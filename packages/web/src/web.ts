import { Glue42Web, GlueWebFactoryFunction } from "../web";
import { Glue42Core, GlueCoreFactoryFunction } from "@glue42/core";
import { version } from "../package.json";
import { Windows } from "./windows/main";
import { Layouts } from "./layouts/main";
import { Channels } from "./channels/main";
import { Glue42DesktopWindowContext } from "./types";
import { Notifications } from "./notifications/main";
import { defaultWorkerLocation } from "./config/defaults";
import { buildConfig } from "./config/config";
import { Control } from "./control/control";
import { SaveAutoLayoutCommand } from "./control/commands";
import { initStartupContext } from "./windows/startup";
import { LocalWebWindow } from "./windows/my";
import { LayoutsController } from "./layouts/controller";
import { LayoutStorage } from "./layouts/storage";
import { LocalStore } from "./layouts/stores/local";
import { JSONStore } from "./layouts/stores/json";
import { AutoStorage } from "./layouts/stores/auto";
import { RemoteStore } from "./layouts/types";

const hookCloseEvents = (api: Glue42Web.API, config: Glue42Web.Config, control: Control, layoutsController?: LayoutsController): void => {
    // hook up page close event's, so we can cleanup properly
    let done = false;
    const doneFn = async (): Promise<void> => {
        if (!done) {
            done = true;
            const shouldSave = config?.layouts?.autoRestore;
            if (shouldSave) {
                // we don't have enough time to save the layout, we will instruct one of the windows we opened to save it
                const allChildren = (api.windows as Windows).getChildWindows().map((w) => w.id);
                const firstChild = allChildren[0];
                const layoutName = `_auto_${document.location.href}`;
                if (allChildren.length > 0) {
                    const command: SaveAutoLayoutCommand = {
                        domain: "layouts",
                        command: "saveLayoutAndClose",
                        args: {
                            childWindows: allChildren,
                            closeEveryone: true,
                            layoutName,
                            context: {},
                            metadata: {},
                            parentInfo: layoutsController?.getLocalLayoutComponent({}, true) as Glue42Web.Layouts.LayoutComponent
                        }
                    };
                    control.send(command, { windowId: firstChild });
                } else {
                    layoutsController?.autoSave({ name: layoutName });
                }
            }
            api.done();
        }
    };

    window.addEventListener("beforeunload", () => {
        doneFn();
    });
};

/** This function creates the factory function which is the default export of the library */
export const createFactoryFunction = (coreFactoryFunction: GlueCoreFactoryFunction): GlueWebFactoryFunction => {

    return async (config?: Glue42Web.Config): Promise<Glue42Web.API> => {
        const builtCoreConfig = await buildConfig(config);

        // Used for testing in node environment.
        const isWebEnvironment = typeof window !== "undefined";

        // Whether to initialize the Channels API or not.
        const shouldInitializeChannels = builtCoreConfig.glue?.channels || false;

        // check if we're running in Glue42 Enterprise, if so return @glue42/desktop API
        if (isWebEnvironment) {
            const gdWindowContext = window as unknown as Glue42DesktopWindowContext;
            if (gdWindowContext?.glue42gd && gdWindowContext?.Glue) {
                return gdWindowContext.Glue({
                    windows: true,
                    logger: builtCoreConfig.glue?.logger,
                    channels: shouldInitializeChannels,
                    layouts: true
                });
            }
        }

        // create @glue42/core with the extra libs for @glue42/web
        const control = new Control();
        let windows: Windows;
        let layoutsController: LayoutsController | undefined;

        const ext: Glue42Core.Extension = {
            libs: [
                {
                    name: "notifications",
                    create: (coreLib): Notifications => new Notifications(coreLib.interop)
                }
            ],
            version
        };

        if (shouldInitializeChannels) {
            const channelsLib: Glue42Core.ExternalLib = {
                name: "channels",
                create: (coreLib): Channels => new Channels(coreLib.contexts, builtCoreConfig.channels)
            };
            ext.libs?.push(channelsLib);
        }

        if (isWebEnvironment) {
            ext.libs?.push(
                {
                    name: "windows",
                    create: (coreLib): Windows => {
                        windows = new Windows(coreLib.interop, control);
                        return windows;
                    }
                },
                {
                    name: "layouts",
                    create: (coreLib): Layouts => {

                        let remoteStore: RemoteStore | undefined;

                        if (builtCoreConfig.layouts?.remoteType === "json") {
                            remoteStore = new JSONStore("/glue");
                        }

                        const localStore = new LocalStore();
                        const autoStore = new AutoStorage();
                        const layoutsStorage = new LayoutStorage(localStore, autoStore, remoteStore);
                        layoutsController = new LayoutsController(layoutsStorage, windows, control, coreLib.interop, builtCoreConfig?.glue);
                        return new Layouts(layoutsController);
                    }
                }
            );
        }

        const coreConfig = {
            gateway: {
                sharedWorker: builtCoreConfig.glue?.worker ?? defaultWorkerLocation,
                inproc: builtCoreConfig.glue?.inproc
            },
            logger: builtCoreConfig.glue?.logger
        };

        const core = await coreFactoryFunction(coreConfig, ext) as Glue42Web.API;
        // start control component
        control.start(core.interop, core.logger.subLogger("control"));
        if (isWebEnvironment) {
            // fill in our window context
            await initStartupContext(core.windows.my() as LocalWebWindow, core.interop);
            // if there is a saved layout restore it
            if (builtCoreConfig.glue?.layouts?.autoRestore) {
                await layoutsController?.restoreAutoSavedLayout();
            }
            await hookCloseEvents(core, builtCoreConfig.glue ?? {}, control, layoutsController);
        }

        return core;
    };
};
