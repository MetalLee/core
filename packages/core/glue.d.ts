import { UnsubscribeFunction } from "callback-registry";

/**
 * Factory function that creates a new Glue42 instance.
 */
export default function GlueCoreFactory(config?: Glue42Core.Config, ext?: Glue42Core.Extension): Promise<Glue42Core.GlueCore>;

declare global {
    interface Window {
        htmlContainer?: Glue42Core.HtmlContainerObject;
        glueDesktop?: Glue42Core.GlueDesktopObject;
        glue42gd?: Glue42Core.GDObject;
        gdPreloadPromise: Promise<Glue42Core.GDObject>;
        WebSocket: any;
        XDomainRequest?: any;
    }
}

// tslint:disable-next-line:no-namespace
export namespace Glue42Core {

    /** @ignore */
    export interface GlueDesktopObject {
        version: string;
    }

    /** @ignore */
    export interface HtmlContainerObject {
        activityFacade: {
            init: () => void;
            init2: () => void;
            getActivityTypes: () => void;
            subscribeForJoinBreakEvents?: () => void;
            unregisterActivityType: () => void;
            registerActivityType: () => void;
            getWindowTypes: () => void;
            registerWindowFactory: () => void;
            initiate: () => void;
            getActivities: () => void;
            setActivityContext: () => void;
        };
        applicationName: string;
        env: {
            env: string;
            machineName: string;
            region: string;
            windowsUserDomain: string;
            windowsUserId: string;
            windowsUserName: string;
        };
        getFrameColors: () => string[];
        browserWindowName: string;
        containerName: string;
        containerVersion: string;
        machineName: string;
        jsAgmFacade: {
            protocolVersion: number;
            jsonValueDatePrefix: string;
            initAsync(cfg: string, success: (i: Glue42Core.AGM.Instance) => void, error: (err: string) => void): void;
            init(cfg: string): Glue42Core.AGM.Instance;

            register(method: string, handler: ((args: string, caller: Glue42Core.AGM.Instance) => string) | ((args: object, caller: Glue42Core.AGM.Instance) => void | object | Promise<object>), returnAsJson?: boolean): void;
            registerAsync(method: object, callback: (args: any, instance: Glue42Core.AGM.Instance, tracker: any) => void | Promise<void>): void;

            unregister(name: string): void;

            invoke(method: string, args: string, target: string, options: string, success: (result: any) => void, error: (err: string) => void): void;
            invoke2(method: string, args: string, target: string, options: string, success: (result: any) => void, error: (err: string) => void): void;

            methodAdded(callback: (method: Glue42Core.AGM.MethodDefinition) => void): void;
            methodRemoved(callback: (method: Glue42Core.AGM.MethodDefinition) => void): void;

            serverAdded(callback: (server: Glue42Core.AGM.Instance) => void): void;
            serverRemoved(callback: (server: Glue42Core.AGM.Instance) => void): void;

            serverMethodAdded(callback: (info: { server: Glue42Core.AGM.Instance, method: Glue42Core.AGM.MethodDefinition }) => void): void;
            serverMethodRemoved(callback: (info: { server: Glue42Core.AGM.Instance, method: Glue42Core.AGM.MethodDefinition }) => void): void;

            methodsForInstance(instance: string): string;

            servers(filter?: string): string;
            methods(filter?: string): string;

            subscribe2(name: string, params: string, success: (sub: Glue42Core.AGM.Subscription) => void, error: (err: string) => void): void;

            createStream2(methodDefinition: string,
                subscriptionRequestHandler: (request: Glue42Core.AGM.SubscriptionRequest) => void,
                subscriptionAddedHandler: (request: Glue42Core.AGM.StreamSubscription) => void,
                subscriptionRemovedHandler: (request: Glue42Core.AGM.StreamSubscription) => void,
                success: (stream: Glue42Core.AGM.Stream) => void,
                error: (err: string) => void): void;
        };
        metricsFacade: {
            done: () => void;
            getIdentity: () => {
                system: string;
                service: string;
                instance: string;
            };
            send(type: string, message: string | object): void;
        };
        loggingFacade: {
            send(type: string, message: string | object): void;
        };
        monitors: Screen[];
        pID: string;
        perfDataNeeded: boolean;
        perfDataDelay?: number;
        updatePerfData: (perf: object) => void;
        sharedContextFacade: {
            all: () => void;
            set: () => void;
            setContext: () => void;
            subscribe: () => void;
            unsubscribe: () => void;
            update: () => void;
            updateContext: () => void;
        };
        windowId: string;
        windowStyleAttributes: string;
        getContext: () => object;
    }

    /** Object describing a screen. */
    export interface Screen {
        /** Screen height. */
        height: number;
        /** Whether this is the primary screen. */
        isPrimary: boolean;
        /** Horizontal coordinate of the top left corner of the screen. */
        left: number;
        /** Name of the screen assigned by the operating system. */
        name: string;
        /** Screen scale factor. */
        scale: number;
        /** Scale factor of the horizontal axis of the screen. */
        scaleX: number;
        /** Scale factor of the vertical axis of the screen. */
        scaleY: number;
        /** Vertical coordinate of the top left corner of the screen. */
        top: number;
        /** Screen width. */
        width: number;
        /** Height of the working area. */
        workingAreaHeight: number;
        /** Horizontal coordinate of the top left corner of the screen working area. */
        workingAreaLeft: number;
        /** Vertical coordinate of the top left corner of the screen working area. */
        workingAreaTop: number;
        /** Width of the working area. */
        workingAreaWidth: number;
    }

    /** @ignore */
    export interface GlueDesktopObject {
        version: string;
    }

    /** @ignore */
    export interface GDObject {
        /** Id of the window */
        windowId: string;
        /** Name of the application running in the window */
        appName: string;
        /** Name of the application running in the window */
        applicationName: string;
        application: string;
        /** Instance of the application running in the window */
        appInstanceId: string;
        gwURL: string;
        pid: number;
        env: {
            env: string;
            machineName: string;
            region: string;
            windowsUserDomain: string;
            windowsUserId: string;
            windowsUserName: string;
        },
        activityInfo: {
            activityId: string,
            activityType: string,
            windowType: string,
            windowName: string,
            gwToken: string,
            isOwner: boolean
        };
        updatePerfData: (perf: object) => void;
        getGWToken(): Promise<string>;
        getWindowInfo(id: string): {
            applicationName: string;
            activityId?: string;
            activityWindowId?: string;
        };
        getMetricsPublishingEnabled: () => boolean;
    }

    /** Optional configuration object when initializing the Glue42 library. */
    export interface Config {
        /**
         * Application name. If not specified, the value depends on the hosting environment.
         * For the browser - `document.title + random number` (e.g., ClientList321333).
         * In Glue42 - `containerName + browserWindowName` (e.g., Internal.ClientList).
         */
        application?: string;

        /** Configurations for the Glue42 Gateway connection. */
        gateway?: GatewayConfig;

        /** Metrics configurations. */
        metrics?: boolean | MetricsConfig;

        /** Enable or disable the Interop API. */
        agm?: boolean;

        /** Enable or disable the Pub/Sub API. */
        bus?: boolean;

        /** Defines logging levels per output target. */
        logger?: LoggerConfig | string;

        customLogger?: CustomLogger;

        /**
          * Authentication can use one of the following flows:
          * - username/password;
          * - `token` - access tokens can be generated after successful login from the Auth Provider (e.g., Auth0);
          * - `gatewayToken` - Gateway tokens are time limited tokens generated by the Gateway after an explicit request. To generate one, use the `glue.connection.authToken()` method;
          * - `sspi` - using `sessionId` and authentication challenge callback;
          */
        auth?: Glue42Core.Auth | string;
    }

    export interface CustomLogger {
        debug(message?: any, ...optionalParams: any[]): void;
        error(message?: any, ...optionalParams: any[]): void;
        info(message?: any, ...optionalParams: any[]): void;
        log(message?: any, ...optionalParams: any[]): void;
        warn(message?: any, ...optionalParams: any[]): void;
    }

    /** Configurations for the Glue42 Gateway connection. */
    export interface GatewayConfig {
        /** URL for the WebSocket connections to the Gateway. */
        ws?: string;

        /** URL for the HTTP connections to the Gateway. */
        http?: string;

        /** Version of the Gateway that you are connected to. Possible values are: 1, 2, 3. */
        protocolVersion?: number;

        /**
         * Reconnect interval in milliseconds.
         * @default 500
         */
        reconnectInterval?: number;

        /**
         * Number of reconnect attempts.
         * @default 10
         */
        reconnectAttempts?: number;

        /** A way to pass custom token provider for Gateway v.3 tokens. */
        gwTokenProvider?: GwTokenProvider;

        /**
         * Connect to a Gateway running in the same process
         * (you can spin off one by using the tick42-gateway package).
         * Works only if `protocolVersion` is 3.
         */
        inproc?: GwProcConfig;

        /**
         * @ignore
         * if `protocolVersion` is 3, this is used to create the connection `replayer`
         * property. Allows out-of-band subscription and replaying of Glue42 messages.
         */
        replaySpecs?: Glue42Core.Connection.MessageReplaySpec[];

        /**
         * If `true`, will always connect to the Gateway,
         * no matter what environment the app is running in.
         * @default false
         */
        force?: boolean;
    }

    /** A way to pass custom token provider for Gateway v.3 tokens. */
    export interface GwTokenProvider {
        get: () => string;
    }

    /**
     * Connect to a Gateway running in the same process
     * (you can spin off one by using the tick42-gateway package).
     * Works only if `protocolVersion` is 3.
     */
    export interface GwProcConfig {
        /** Token returned when starting the Gateway from the `tick42-gateway` package. */
        token: string;

        /** Facade object. This is the default export of `tick42-gateway`. */
        facade: Glue42Core.Connection.GW3Facade;
    }

    /** Metrics configurations. */
    export interface MetricsConfig {

        /**
         * Metrics system, if not specified defaults to:
         * - browser - "Browser"
         * - HC - "HtmlContainer" + container_name
         */
        system?: string;

        /**
         * Metrics service, if not specified defaults to:
         * - browser - document.title || "unknown"
         * - HC - "JS." + browser_window_name
         */
        service?: string;

        /**
         * Metrics instance, if not specified defaults to:
         * - browser - "~" + random_number
         * - HC - "~" + machine_name
         */
        instance?: string;
        /**
         *  If `false` (default), an App system will be created on top level, and all other metrics will live in it.
         *  If `true`, an App system will be created, and all metrics will live on top level.
         */
        disableAutoAppSystem?: boolean;
    }

    /** Logger configuration. */
    export interface LoggerConfig {
        /** Console logging level. */
        console: string;
        /** File logging level. */
        publish: string;
        /** Metrics logging level. */
        metrics: string;
    }

    export interface Extension {
        /* Array of libs to be injected to glue - use only in libraries that wrap glue-core*/
        libs?: ExternalLib[];

        /* Allow to override version - use only in libraries that wrap glue-core **/
        version?: string;

        /* Allow wrappers to enrich glue object **/
        enrichGlue?: (glue: GlueCore) => void;

        /* Extension options object that will be merged to the config object of glue core **/
        extOptions?: any;
    }

    export interface ExternalLib {
        name: string;
        create: (core: GlueCore) => GlueInnerLib;
    }

    /**
     * Authentication can use one of the following flows:
     * * username/password;
     * * `token` - access tokens can be generated after successful login from the Auth Provider (e.g., Auth0);
     * * `gatewayToken` - Gateway tokens are time limited tokens generated by the Gateway after an explicit request. To generate one, use the `glue.connection.authToken()` method;
     * * `sspi` - using `sessionId` and authentication challenge callback;
     */
    export interface Auth {
        /** Username to be used */
        username?: string;

        /** Password to be used */
        password?: string;

        flowName?: "sspi";

        flowCallback?: (sessionId: string, token: any) => Promise<{ data: any }>;

        sessionId?: string;

        /**
         * Authenticate using token generated from the auth provider.
         */
        token?: string;

        /**
         * Authenticate using gatewayToken
         */
        gatewayToken?: string;
    }

    export interface GlueCore {
        /** Connection library. */
        connection: Glue42Core.Connection.API;

        /** Logger library. */
        logger: Glue42Core.Logger.API;

        /** Interop library. */
        agm: Glue42Core.AGM.API;

        /** Interop library. */
        interop: Glue42Core.Interop.API;

        /** Pub/Sub library. */
        bus: Glue42Core.Bus.API;

        /** Metrics library. */
        metrics: Glue42Core.Metrics.API;

        /** Contexts library. */
        contexts: Glue42Core.Contexts.API;

        /** Brings up the Glue42 Desktop feedback dialog. */
        feedback: (info?: FeedbackInfo) => void;

        /** Info object containing versions of all included libraries and Glue42 itself. */
        info: object;

        /** Glue42 version. */
        version: string;

        /**
         * @ignore
         * Performance data
         */
        performance?: object;

        /**
         * @ignore
         * Config as passed from the user
         */
        userConfig: Config;

        /**
         * @ignore
         * The config used by the library. This is a transformed and possibly extended version of the userConfig object
         */
        config?: any;

        /**
         * Disposes Glue42 API. This will remove all Interop methods and streams registered by the application.
         */
        done(): Promise<void>;
    }

    /**
     * Allows customizing the feedback form
     */
    export interface FeedbackInfo {
        /** Will be added to the description field in the feedback form */
        message?: string;
    }

    /** @ignore */
    export interface GlueInnerLib {
        version?: string;
        ready?: () => Promise<any>;
        initTime?: number;
        initStartTime?: number;
        initEndTime?: number;
    }



    /**
     * @docmenuorder 1
     * @docName Interop
     * @intro
     * The **Interop** API enables applications to:
     *
     * - **offer functionality** to other applications (JavaScript **and** native executables) by **registering** Interop methods
     * - **discover applications which offer methods**
     * - **invoke** (call) methods on the user's desktop and across the network
     * - **stream and subscribe for real-time data** using the Streaming API.
     *
     * We call applications which offer methods and streams *Interop servers*, and applications which consume them - *Interop clients*, and collectively - **Interop instances**.
     *
     * ![Interop instances](../../../../images/interop/interop.gif)
     *
     * Any running instance of an Interop application is identified by its **Interop instance**, which is a set of known key/value pairs uniquely identifying an application:
     *
     * **Environment** and **region** are used to qualify an instance. Usually **region** is a geographical location and **environment** refers to the deployment model (development or production).
     *
     * |Key|Example (Value)|Description|
     * |---|-------|-----------|
     * |**application**|Client Portfolio|Application name|
     * |**region**|TICK42|e.g. EMEA, NA, APAC|
     * |**environment**|TRAINING|e.g. DEV, SIT, UAT, PROD|
     * |**service**|null|Optional namespace with a region and environment|
     * |**machine**|Lambda|User machine name|
     * |**PID**|2864|Process ID|
     * |**user**|JSmith|Currently logged on user|
     *
     * See also the [**Interop**](../../../../glue42-concepts/data-sharing-between-apps/interop/javascript/index.html) documentation for more details.
     */
    export namespace Interop {
        /**
         * @ignore
         */
        export interface Settings {
            connection: Connection.API;
            logger: Logger.API;
            instance: any;
            /** Default for how much to wait for method to appear when invoking. If not set 10000
             * @default 10000
             */
            waitTimeoutMs?: number;
            /** Default for how much to wait of the method to respond when invoking. If not set 10000
             * @default 10000
             */
            methodResponseTimeout?: number;
            /** If set will use AGM through GW  */
            forceGW?: boolean;
            gdVersion: number;
        }

        /**
         * Which Interop server(s) to target when invoking Interop methods or subscribing to Interop streams.
         * @default "best"
         */
        export type InstanceTarget = "best" | "all" | "skipMine" | Instance | Instance[];
        /**
         * @docmenuorder 1
         */
        export interface API extends GlueInnerLib {

            /** Instance of the current application. */
            instance: Instance;

            /**
             * Registers a new Interop method.
             * @example
             * ```javascript
             * glue.interop.register(
             *     {
             *         name: "Sum", // required - method name
             *         accepts: "int a, int b", // optional - parameters signature
             *         returns: "int answer" // optional - result signature
             *     },
             *     (args) => {   // required - handler function
             *         return { answer: args.a + args.b };
             *     }
             * );
             * ```
             * @param name  A unique string or a [`MethodDefinition`](#!MethodDefinition) for the method to be registered.
             * @param handler The JavaScript function that will be called when the method is invoked.
             */
            register(name: string | MethodDefinition, handler: (args: object, caller: Instance) => object | void): Promise<void>;

            /**
             * Registers a new async Interop method. Async methods can delay returning the result
             * from the method invocation.
             * @param name  A unique string or a [`MethodDefinition`](#!MethodDefinition) for the method to be registered.
             * @param handler The JavaScript function that will be called when the method is invoked. Accepts two extra arguments - a `success` and an `error` callbacks.
             * To return a result, you must call the `success` callback, or the `error` callback for errors.
             */
            registerAsync(name: string | MethodDefinition, handler: (args: object, caller: Instance, successCallback: (args?: object) => void, errorCallback: (error?: string | object) => void) => void): Promise<void>;

            /**
             * Unregisters an Interop method.
             * @param definition The unique `name` or the [`MethodDefinition`](#!MethodDefinition) of the method to be unregistered.
             */
            unregister(definition: string | MethodDefinition): void;

            /**
             * Invokes an Interop method with some arguments on target servers.
             * @example
             * ```javascript
             * glue.interop.invoke(
             *     "Sum",
             *     { a: 37, b: 5 }) // everything else is optional
             *     .then(successResult => {
             *         console.log(`37 + 5 = ${successResult.returned.answer}`);
             *     })
             *     .catch(err => {
             *         console.error(`Failed to execute Sum ${err.message}`);
             *     });
             * ```
             * @param method The unique `name` or the [`MethodDefinition`](#!MethodDefinition) of the method to be invoked.
             * @param argumentObj A plain JavaScript object (or JSON) holding key/value pairs passed as named arguments to the handler of the registered Interop method.
             * @param target Specifies which servers to target. Can be one of: "best", "all", [`Instance`](#!Instance), `Instance[]`.
             * @param options An optional [`InvokeOptions`] object specifying the timeouts to discover a method and to wait for a method reply.
             * @param success An [`InvokeSuccessHandler`](#InvokeSuccessHandler) handler to be called if the invocation succeeds.
             * @param error An [`InvokeErrorHandler`](#InvokeErrorHandler) handler to be called in case of error.
             */
            invoke(method: string | MethodDefinition, argumentObj?: object, target?: InstanceTarget, options?: InvokeOptions, success?: InvokeSuccessHandler<any>, error?: InvokeErrorHandler): Promise<InvocationResult<any>>;

            invoke<T>(method: string | MethodDefinition, argumentObj?: object, target?: InstanceTarget, options?: InvokeOptions, success?: InvokeSuccessHandler<T>, error?: InvokeErrorHandler): Promise<InvocationResult<T>>;

            /**
             * Creates a new Interop stream.
             * @example
             * ```javascript
             * glue.interop.createStream(
             *     {
             *         name: "MarketData.LastTrades",
             *         displayName: "Publishes last trades for a symbol",
             *         objectTypes: ["Symbol"],
             *         accepts: "String symbol",
             *         returns: "String symbol, Double lastTradePrice, Int lastTradeSize"
             *     })
             *     .then((stream) =>
             *         setInterval(() =>
             *             stream.push(
             *                 {
             *                     symbol: "GOOG",
             *                     lastTradePrice: 700.91,
             *                     lastTradeSize: 10500
             *                 }),
             *             5000)
             *     )
             *     .catch(console.error);
             * ```
             * @param methodDefinition A unique string or a [`MethodDefinition`](#!MethodDefinition) for the stream to be registered.
             * @param options The [`StreamOptions`](#StreamOptions) object allows you to pass several optional callbacks which let your application
             * handle subscriptions in a more detailed manner.
             * @param successCallback An optional handler to be called if the creation of the stream succeeds.
             * @param errorCallback An optional handler to be called in case of an error when creating a stream.
             */
            createStream(methodDefinition: string | MethodDefinition, options?: StreamOptions, successCallback?: (args?: object) => void, errorCallback?: (error?: string | object) => void): Promise<Stream>;

            /** Subscribes to an Interop stream.
             * @example
             * ```javascript
             * glue.interop.subscribe(
	         *     "MarketData.LastTrades",
	         *     {
	         *     	   arguments: { symbol: "GOOG" },
	         *     	   target: "all"
	         *     })
	         *     .then((subscription) => {
	         *     	    // use subscription
	         *     })
	         *     .catch((error) => {
	         *     	    // subscription rejected or failed
	         *     });
             * ```
             * @param methodDefinition The unique `name` or the [`MethodDefinition`](#!MethodDefinition) of the stream to subscribe to.
             * @param parameters An optional [`SubscriptionParams`](#SubscriptionParams) object with parameters.
             */
            subscribe(methodDefinition: string | MethodDefinition, parameters?: SubscriptionParams): Promise<Subscription>;

            /**
             * Returns all Interop aware applications.
             * Optionally, the list can be filtered to return only servers providing specific Interop method(s)
             * by passing a `methodFilter`.
             * @param filter An object describing a filter matching one or more Interop methods.
             */
            servers(filter?: MethodFilter): Instance[];

            /**
             * Returns all methods that match the passed filter.
             * If no filter is specified, returns all methods.
             * @param filter An object describing a filter matching one or more Interop methods.
             */
            methods(filter?: MethodFilter): MethodDefinition[];

            /**
             * Subscribes to the event which fires when a method is added for the first time by any application.
             * @param callback A handler to be called when the event fires.
             */
            methodAdded(callback: (method: MethodDefinition) => void): UnsubscribeFunction;

            /** Subscribes to the event which fires when a method is removed from the last application offering it.
             * @param callback A handler to be called when the event fires.
             */
            methodRemoved(callback: (method: MethodDefinition) => void): UnsubscribeFunction;

            /** Subscribes to the event which fires when an application offering methods is discovered.
             * @param callback A handler to be called when the event fires.
             */
            serverAdded(callback: (server: Instance) => void): UnsubscribeFunction;

            /** Subscribes to the event which fires when an app offering methods stops offering them or exits.
             * @param callback A handler to be called when the event fires.
             */
            serverRemoved(callback: (server: Instance) => void): UnsubscribeFunction;

            /**
             * Subscribes to the event which fires when an application starts offering a method. This will be called every time a server starts offering the method,
             * whereas [`methodAdded()`](#!API-methodAdded) will be called only the first time the method is registered.
             */
            serverMethodAdded(callback: (info: {
                server: Instance;
                method: MethodDefinition;
            }) => void): UnsubscribeFunction;

            /**
             * Subscribes for the event which fires when a server stops offering a method. This will be called every time a server stops offering the method,
             * whereas [`methodRemoved()`](#!API-methodRemoved) will be called only when the method is removed from the last application offering it.
             * @param callback A handler to be called when the event fires.
             */
            serverMethodRemoved(
                callback: (
                    info: {
                        server: Instance;
                        method: MethodDefinition;
                    }
                ) => void): UnsubscribeFunction;

            /** Returns all Interop methods registered by a server.
             * @param server An Interop [`Instance`](#!Instance) identifying an application.
             */
            methodsForInstance(server: Instance): MethodDefinition[];
        }

        /** Optional object with parameters passed to [`subscribe()`](#!API-subscribe) when subscribing to a stream. */
        export interface SubscriptionParams {

            /** Specifies which servers to target. Can be one of: "best", "all", [`Instance`](#!Instance), `Instance[]`. */
            target?: InstanceTarget;

            /** A plain JavaScript object (or JSON) holding key/value pairs passed as named arguments to the handler of the registered Interop stream. */
            arguments?: object;

            /**
             * Timeout to wait for a stream reply.
             * @default 30000
             */
            methodResponseTimeout?: number;

            /**
             * Timeout to discover the stream, if not immediately available.
             * @default 30000
             */
            waitTimeoutMs?: number;

            /** Subscribe for the event which fires when new data is received. */
            onData?: (data: StreamData) => void;

            /** Subscribe for the event which fires when the subscription is closed. */
            onClosed?: () => void;

            onConnected?: (server: Instance, reconnect: boolean) => void;
        }

        /** A subscription request object handled by the server that has created the stream. It can be accepted or rejected. */
        export interface SubscriptionRequest {

            /** Instance of the application that wants to subscribe to the stream. */
            instance: Instance;

            /** Arguments passed with the subscription request. */
            arguments: object;

            /** Accepts the subscription request. */
            accept(): void;

            /**
             * Accepts the request on a stream branch.
             * @param branchKey Key of the branch on which to accept the request.
             */
            acceptOnBranch(branchKey: string): void;

            /**
             * Rejects the request.
             * @param reason Reason for rejecting the request.
             */
            reject(reason?: string): void;
        }
        /** Optional handlers that can be supplied when creating streams. */
        export interface StreamOptions {

            /**
             * Subscribes for subscription requests. These can be accepted, rejected or accepted on a custom branch.
             * If this handler is attached, each request should be explicitly accepted.
             */
            subscriptionRequestHandler?: (request: SubscriptionRequest) => void;

            /** Subscribes to the event which fires when a stream subscription is added. */
            subscriptionAddedHandler?: (request: StreamSubscription) => void;

            /** Subscribes to the event which fires when a stream subscription is removed. */
            subscriptionRemovedHandler?: (request: StreamSubscription) => void;
        }

        /**
         * Object describing an Interop stream.
         */
        export interface Stream {

            /** Stream definition object. */
            definition: MethodDefinition;

            /** Name of the stream. */
            name: string;

            /**
             * Push data to the stream. If a `branches` argument is passed, the data will be sent to the specified stream branch(es) only.
             * @param data Data to push.
             * @param branches To which branch(es) to push data.
             */
            push(data: object, branches?: string | string[]): void;

            /**
             * Returns the list of available stream branches.
             * If `key` is specified, returns the corresponding stream branch or `null`.
             * @param key Branch key.
             */
            branches(): StreamBranch[];
            branches(key: string): StreamBranch;
            branches(key?: string): StreamBranch[] | StreamBranch;

            /** Returns a list of active subscriptions to the stream. */
            subscriptions(): StreamSubscription[];

            /** Closes the stream. This will close all subscriptions. */
            close(): void;
        }

        /** A stream branch created by the application. */
        export interface StreamBranch {

            /** Branch key. */
            key: string;

            /** All subscriptions to that branch. */
            subscriptions(): StreamSubscription[];

            /** Closes the stream branch. */
            close(): void;

            /**
             * Pushes data to this branch only.
             * @param data Data to push.
             */
            push(data: object): void;
        }
        /** An object describing a subscription to an Interop stream. */
        export interface StreamSubscription {

            /** Arguments used when the subscription was made. */
            arguments: any;

            /** The key of the stream branch to which the subscription was made. */
            branchKey: string;

            /** Instance of the subscriber. */
            instance: Instance;

            /** The stream to which the subscription was made. */
            stream: Stream;

            /** Closes the subscription. This will not close the stream. */
            close(): void;

            /**
             * Pushes data to this subscription only.
             * @param data Data to push.
             */
            push(data: object): void;
        }

        /** Stream subscription made by an application. */
        export interface Subscription {

            /** Arguments used to make the subscription. */
            requestArguments: object;

            /** Instances of the applications providing the stream, that we have subscribed to */
            servers: Instance[];

            /**
             * @deprecated use servers
             * Instance of the application providing the stream.
             */
            serverInstance: Instance;

            /** Stream definition. */
            stream: MethodDefinition;

            /**
             * @deprecated use {@link SubscriptionParams#onData} instead.
             * Subscribe for the event which fires when new data is received.
             */
            onData(callback: (data: StreamData) => void): void;

            /**
             * @deprecated use {@link SubscriptionParams#onClosed} instead.
             * Subscribe for the event which fires when the subscription is closed.
             */
            onClosed(callback: (info: OnClosedInfo) => void): void;

            /**
             * @deprecated
             */
            onFailed(callback: (err: any) => void): void;

            onConnected(callback: (server: Instance, reconnect: boolean) => void): void;

            /** Closes the subscription. */
            close(): void;
        }


        /** Addition information around subscription being closed */
        export interface OnClosedInfo {
            message: string;
            requestArguments: object;
            server: Instance;
            stream: {info: MethodDefinition};
        }

        /** Stream data received by the subscriber. */
        export interface StreamData {

            /** Data from the stream. */
            data: any;

            /** Instance of the application publishing the stream. */
            server: Instance;

            /** Arguments used when the subscription was made. */
            requestArguments: object;

            /** Message from the publisher of the stream. */
            message: string;

            /** If `true`, the data was sent to this application only. */
            private: boolean;
        }

        /** An object describing an Interop method registered by an application. */
        export interface MethodDefinition {

            /** The name of the method. Must be unique. */
            name: string;

            /** The entities this method is meant to work with. */
            objectTypes?: string[];

            /** The actual name of the method, used in UI applications. */
            displayName?: string;

            /** Signature describing the parameters that the method expects. */
            accepts?: string;

            /** Signature describing the properties of the object the method returns. */
            returns?: string;

            /** Description of what the method does. Useful for documentation purposes and for UI clients. */
            description?: string;

            /** Method version. */
            version?: number;

            /** If `true`, the method is a stream. */
            supportsStreaming?: boolean;

            /** Returns all servers that provide the method. */
            getServers?: () => Instance[];
        }

        /** An object describing a filter matching one or more Interop methods. */
        export interface MethodFilter {

            /** The name of the method. Must be unique. */
            name?: string;

            /** The entities this method is meant to work with. */
            objectTypes?: string[];

            /** The actual name of the method, used in UI applications. */
            displayName?: string;

            /** Signature describing the parameters that the method expects. */
            accepts?: string;

            /** Signature describing the properties of the object the method returns. */
            returns?: string;

            /** Description of what the method does. Useful for documentation purposes and for UI clients. */
            description?: string;
        }

        /** Each Interop application is identified by its Interop instance, which is a set of known key/value pairs. */
        export interface Instance {

            /** Unique application name. */
            application?: string;

            /** Application name */
            applicationName?: string;

            /** Process ID of the instance. */
            pid?: number;

            /** Name of the machine the instance is running on. */
            machine?: string;

            /** Name of the user who has started the instance. */
            user?: string;

            /** Environment in which the application is running. */
            environment?: string;

            /** Region in which the application is running. */
            region?: string;

            /** Service string of the application. */
            service?: string;

            /** (Glue42 Desktop 3.0 only) Unique string identifying the application. */
            instance?: string;

            /** (Glue42 Desktop 3.0 only) Window ID of the instance. Only set if running in a Glue42 window. */
            windowId?: string;

            /** (Glue42 Desktop 3.0 only) Gateway peer ID of the instance. */
            peerId?: string;

            /** (Glue42 Desktop 3.0 only) A flag indicating whether the instance is running on a local machine or not. Taken into account when a Gateway mesh is present - local instances are preferred when invoking methods. */
            isLocal?: boolean;

            /** API version */
            api?: string;

            /** Returns all methods registered by that instance. */
            getMethods?(): MethodDefinition[];

            /** Returns all streams registered by that instance. */
            getStreams?(): MethodDefinition[];
        }

        /** Method invocation options. */
        export interface InvokeOptions {

            /**
             * Timeout to discover the method, if not immediately available.
             * @default 3000
             */
            waitTimeoutMs?: number;

            /**
             * Timeout to wait for a method reply.
             * @default 10000
             */
            methodResponseTimeoutMs?: number;
        }

        /** Result from a method invocation. */
        export interface InvocationResultCore<T> {

            /** Returned object. */
            returned: T;

            /** Method definition of the method that was invoked. */
            method: MethodDefinition;

            /** Instance of the application that executed the method. */
            executed_by: Instance;

            /** Arguments of the invocation. */
            called_with: any;

            /** Message from the application that executed the method. */
            message: string;

            /** Status sent by the application that executed the method. */
            status: number;
        }

        /** Extends [`InvocationResultCore`](#!InvocationResultCore). Results from a method invocation. */
        export interface InvocationResult<T> extends InvocationResultCore<T> {

            /** An array of invocation results. */
            all_return_values?: Array<InvocationResultCore<T>>;

            /** An array of error objects. */
            all_errors?: any[];
        }

        /**
         * Handler to be called if the method invocation succeeds.
         * @param result Result from the method invocation.
         */
        export type InvokeSuccessHandler<T> = (result: InvocationResult<T>) => void;

        /**
         * Handler to be called in case of method invocation error.
         * @param error An error object.
         */
        export type InvokeErrorHandler = (error: {
            method: MethodDefinition;
            called_with: object;
            executed_by: Instance;
            message: string;
            status: number;
            returned: object;
        }) => void;
    }

    /**
     * Interop legacy alias
     * @ignore
     */
    export import AGM = Interop;

    /**
     * @docmenuorder 5
     * @intro
     * The Glue42 Gateway is a transport with domain specific protocols. It enables the communication between applications running in **Glue42 Desktop**.
     * By default, it uses WebSockets for delivering messages to applications.
     *
     * The Connection module is used to provide connectivity between the Glue42 JavaScript modules (Interop, Metrics, etc.) and the Glue42 Gateway.
     * Applications can use different events (`connected`, `disconnected`) to show connectivity status.
     */
    export namespace Connection {
        /**
         * Settings used to initialize connection library
         *
         * @ignore
         */
        export interface Settings {
            identity?: Identity;
            logger?: Logger.API;
            protocolVersion?: number;
            ws?: string;
            http?: string;
            httpInterval?: number;
            /** If connection is lost, try reconnecting on some interval */
            reconnectInterval?: number;
            /** If connection is lost, how many times to try */
            reconnectAttempts?: number;
            /**
             * Use this to initialize with gateway object.
             * The connection will use that object as inproc transport to GW.
             * This will only work if protocolVersion is 3 otherwise will be ignored
             */
            gw?: {
                facade: GW3Facade;
            };
            force?: boolean;
            replaySpecs?: MessageReplaySpec[];
            gdVersion?: number;
        }
        /** @ignore */
        export interface Identity {
            /* unique application name  */
            application?: string;
            /* the application name */
            applicationName?: string;
            instance?: string;
            region?: string;
            environment?: string;
            machine?: string;
            process?: number;
            system?: string;
            service?: string;
            user?: string;
            windowId?: string;
            api?: string;
        }
        /**
         * Connection to the Glue42 Gateway.
         */
        export interface API extends GlueInnerLib {
            /**
             * Protocol version of the current connection.
             */
            protocolVersion: number;
            /**
             * Send a new message using the connection
             *
             * @ignore
             */
            send(product: string, type: string, message: object, id?: string, options?: SendMessageOptions): Promise<void>;
            /**
             * Subscribe for messages. Returns an object that can be used to unsubscribe
             *
             * @ignore
             */
            on(product: string, type: string, messageHandler: (msg: object) => void): {
                type: string;
                id: number;
            };
            /**
             * Cancel subscription for message types
             *
             * @ignore
             */
            off(info: {
                type: string;
                id: number;
            }): void;
            /** @ignore */
            login(message: Glue42Core.Auth, reconnect?: boolean): Promise<Identity>;
            /** @ignore */
            logout(): void;

            /**
             * Subscribes for the event which fires when the connection has managed to login (only for connections that support authentication).
             * @param callback Event handler function.
             */
            loggedIn(callback: (() => void)): () => void;

            /**
             * Subscribes for the event which fires when connected.
             * @param callback Event handler function.
             */
            connected(callback: (server: string) => void): () => void;

            /**
             * Subscribes for the event which fires when disconnected.
             */
            disconnected(callback: () => void): () => void;

            reconnect(): Promise<void>;
        }
        /**
         * GW3 connection - adds GW3 specific info and domain session abstraction
         *
         * @ignore
         */
        export interface GW3Connection extends API {
            peerId: string;
            token: string;
            info: object;
            resolvedIdentity: object;
            availableDomains: object[];
            gatewayToken: string;
            replayer: MessageReplayer;
            /**
             * Creates a domain wrapper used to handles domain session lifetime and events for a given connection/domain pair
             */
            domain(domain: string, logger?: Logger.API, successMessages?: string[], errorMessages?: string[]): GW3DomainSession;
            /**
             * Generates a new token that can be passed to another application and used to authenticate as the same user.
             * The token is one off and has time restricted validity.
             * The returned token can be then used when initializing glue:
             *
             * ```javascript
             * Glue({
             *  gateway: {
             *    gatewayToken: token
             *  }
             * })
             * ```
             */
            authToken(): Promise<string>;
        }
        /**
         * GW3 domain session
         *
         * @ignore
         */
        export interface GW3DomainSession {
            peerId: string;
            domain: string;
            /**
             * Joins the domain.
             */
            join(options?: object): Promise<object>;
            /**
             * Leaves the domain.
             */
            leave(): void;
            /**
             * Subscribe for join events (for the specific domain).
             * The wasReconnect flag indicates if this is auto join after connection drop
             */
            onJoined(callback: (wasReconnect: boolean) => void): any;
            /**
             * Subscribe for leave events (for the specific domain).
             */
            onLeft(callback: () => void): any;
            /**
             * Send a message to GW.
             * A promise that is resolved when a success result for the is received or rejected if the GW returns an error
             */
            send(msg: object, tag?: object, options?: SendMessageOptions): Promise<object>;
            /**
             * Use this to send a message to GW if you don't care about the result.
             * You may pass requestId or it will be generated internally
             */
            sendFireAndForget(msg: {
                request_id?: string;
                [key: string]: any;
            }): void;
            /**
             * Subscribe for messages from GW
             */
            on(type: string, callback: (msg: object) => void): void;
            loggedIn(callback: (() => void)): void;
            connected(callback: (server: string) => void): void;
            disconnected(callback: () => void): void;
        }
        /**
         * GW3 facade that allows working with the gateway directly inproc
         * This is exposed from tick42-gateway package
         *
         * @ignore
         */
        export interface GW3Facade {
            connect(handler: (client: GW3Client, msg: object) => void): Promise<GW3Client>;
        }

        export interface GW3Client {
            send(msg: object): void;
        }
        /** @ignore */
        export interface SendMessageOptions {
            skipPeerId?: boolean;
            retryInterval?: number;
            maxRetries?: number;
        }

        /**
        * Allows out-of-band subscription to Gateway messages in `protocolVersion: 3`.
        * @ignore
        */
        export interface MessageReplaySpec {
            /**
             * Used to identify a set of message types,
             * like "context" for ["create-context", "subscribe-context", "subscribed-context", ...]
             */
            name: string;

            /**
             * The types of the messages corresponding to this name.
             */
            types: string[];
        }
        /**
         * @ignore
         */
        export interface MessageReplayer {
            init(connection: Connection.API): void;

            processMessage(type: string, msg: object): void;

            drain(name: string, callback: (msg: object) => void): void;
        }
    }

    /**
     * @docmenuorder 6
     * @intro
     * The Glue42 Logging API enables JavaScript applications to create a hierarchy of sub-loggers mapped to application components
     * where you can control the level of logging for each component. You can also route the output of log messages (depending on the logging level) to a variety of targets:
     * - the developer console;
     * - an external output - usually a rolling file on the desktop, but actually any target the `log4net` library supports;
     * - the **Glue42 Desktop** [Metrics](../../../../glue42-concepts/metrics/overview/index.html) bus;
     * - the [Glue42 Notification Service](../../../../glue42-concepts/notifications/overview/index.html);
     *
     * The last three targets give you the ability to:
     * - connect to a remote desktop and pull the application log files using the Interop Viewer;
     * - connect to the Metrics bus and monitor the application in real time, or record log messages routed to a metrics storage in a Cassandra database for later analysis;
     * - raise notifications which can be displayed via a customizable UI on the user's desktop;
     */
    export namespace Logger {
        /** @ignore */
        export interface Identity {
            instance: string;
            service: string;
            system: string;
        }

        /**
         * Configuration object from Logging library
         * @ignore
         */
        export interface Settings {
            identity: Identity;
            getConnection: () => Connection.API;
            publish: string;
            console: string;
            metrics: string;
        }

        export interface API {

            /** Name of the logger. */
            name: string;

            /** Version of the Logging API. */
            version?: string;

            /**
             * Creates a new logger which is a sub-logger of the current one.
             * @param name Name for the sub-logger.
             */
            subLogger(name: string): Logger.API;

            /**
             * Sets or gets the current threshold level for publishing to a file.
             * @param level Logger level.
             */
            publishLevel(level?: string): string;

            /**
             * Sets or gets the current threshold level for writing to the console.
             * @param level Logger level.
             */
            consoleLevel(level?: string): string;

            /**
             * Sets or gets the current threshold level for publishing metrics.
             * @param level Logger level.
             * @param metricsSystem Metrics system for which to set the logging level.
             */
            metricsLevel(level?: string, metricsSystem?: Metrics.System): string;

            /**
             * Logging method.
             * @param message Message to log.
             * @param level Logging level for the message.
             */
            log(message: string, level?: string): void;

            /**
             * Method for logging messages at "trace" level.
             * @param message Message to log.
             */
            trace(message: string): void;

            /**
             * Method for logging messages at "debug" level.
             * @param message Message to log.
             */
            debug(message: string): void;

            /**
             * Method for logging messages at "info" level.
             * @param message Message to log.
             */
            info(message: string): void;

            /**
             * Method for logging messages at "warn" level.
             * @param message Message to log.
             */
            warn(message: string): void;

            /**
             * Method for logging messages at "error" level.
             * @param message Message to log.
             */
            error(message: string): void;

            canPublish(level: string): boolean;
        }
    }

    /**
     * @docmenuorder 4
     * @intro
     * To improve the efficiency of your business processes, you often find the need to collect extensive data about the daily workflows and routines within your company.
     * You want to see the specific actions your employees take and the choices they make when achieving outstanding results or when performing poorly,
     * so that you can optimize your processes or tools. Metrics data is also useful for technical purposes like monitoring how well your hardware infrastructure handles the workload
     * or to track the performance of your applications.
     *
     * See also the [**Metrics**](../../../../glue42-concepts/metrics/overview/index.html) documentation for more details.
     */
    export namespace Metrics {
        /** @docmenuorder 1 */

        export interface API extends System, GlueInnerLib {
            /**
             * The feature metric is under the subsystem with name "reporting".
             * @param feature The main feature you want to gather information about.
             * @param action The specific action you want to track.
             * @param value The payload of the metric - the value(s) you are interested in.
             *
             * @example
             * ```javascript
             * glue.metrics.featureMetric("export", "exportToExcel", "file.xls")
             * ```
             */
            featureMetric(feature: string, action: string, value: string): void;
        }

        /**
         * Library configuration
         * @ignore
         */
        export interface Settings {
            identity: Identity;
            connection: Connection.API;
            logger: Logger.API;
            heartbeatInterval?: number;
            /** If true will auto create click stream metrics in root system */
            clickStream?: boolean;
            canUpdateMetric?: () => boolean;
        }

        export interface Identity {
            instance: string;
            service: string;
            system: string;
        }

        /** Metrics systems repository. */
        export interface Repository {
            /** Returns the identity of the root system. */
            identity: Identity;

            /** Returns the instance ID of the root system. */
            instance: string;

            /** Returns the root metrics system. */
            root: System;
        }

        /** A metrics system. A system can be created in another system as a subsystem. */
        export interface System {

            /** Returns the name of the system. */
            name: string;

            /** Returns the description of the system. */
            description: string;

            /** Returns the repository of the system. */
            repo: Repository;

            /** Returns the parent system of the current system. */
            parent: System;

            /** An array of parent system names, starting with the root system name. */
            path: string[];

            /** ID of the system in the format `RootName/ParentName/.../CurrentSystemName`. */
            id: string;

            /** Returns the identity of the system. */
            identity: Identity;

            /** The root system in the repository. */
            root: System;

            /** Returns an array of the subsystems. */
            subSystems: System[];

            /** Returns an array of metrics. */
            metrics: Metric[];

            /**
             * Creates a new subsystem.
             * @param name Name for the subsystem.
             * @param description Description for the subsystem.
             */
            subSystem(name: string, description?: string): System;

            /** Returns the system state. */
            getState(): State;

            /**
             * Updates the state of the system.
             * @param state Value for the state.
             * @param description Description for the state.
             */
            setState(state: number, description?: string): void;

            /** Returns the aggregate system state represented as an array of the states of all subsystems. */
            getAggregateState(): SystemStateInfo[];

            /**
             * Creates a new Address Metric.
             * @param definition Metric definition.
             */
            addressMetric(definition: string | MetricDefinition, value: any): AddressMetric;

            /** Creates a new Count Metric.
             * @param definition Metric definition.
             * @param value Metric value.
             */
            countMetric(definition: string | MetricDefinition, value: number): CountMetric;

            /**
             * Creates a new Number Metric.
             * @param definition Metric definition.
             * @param value Metric value.
             */
            numberMetric(definition: string | MetricDefinition, value: number): NumberMetric;

            /**
             * Creates a new Object Metric.
             * @param definition Metric definition.
             * @param value Metric value.
             */
            objectMetric(definition: string | MetricDefinition, value: any): ObjectMetric;

            /**
             * Creates a new Rate Metric.
             * @param definition Metric definition.
             * @param value Metric value.
             */
            rateMetric(definition: string | MetricDefinition, value: any): RateMetric;

            /**
             * Creates a new Statistics Metric.
             * @param definition Metric definition.
             * @param value Metric value.
             */
            statisticsMetric(definition: string | MetricDefinition, value: any): StatisticsMetric;

            /**
             * Creates a new String Metric.
             * @param definition Metric definition.
             * @param value Metric value.
             */
            stringMetric(definition: string | MetricDefinition, value: string): StringMetric;

            /**
             * Creates a new Timespan Metric.
             * @param definition Metric definition.
             * @param value Metric value.
             */
            timespanMetric(definition: string | MetricDefinition, value: any): TimespanMetric;

            /**
             * Creates a new Timestamp Metric.
             * @param definition Metric definition.
             * @param value Metric value.
             */
            timestampMetric(definition: string | MetricDefinition, value: any): TimestampMetric;
        }

        /** @ignore */
        export const enum ConflationMode {
            /**  */
            Sampled = 0,
            /**  */
            TickByTick = 1
        }

        /** State of the metric system. */
        export interface State {
            /** Code number for the state. */
            state?: number;
            /** Description of the state. */
            description?: string;
        }

        /** Metric definition. */
        export interface MetricDefinition {
            /** Name of the metric. */
            name?: string;
            /** Description for the metric. */
            description?: string;
            /** @ignore */
            period?: string;
            /** @ignore */
            resolution?: string;
            /** @ignore */
            conflation?: ConflationMode;
        }

        /** Basic metric. */
        export interface Metric {

            /** Returns the name of the metric. */
            name: string;

            /** Returns the description of the metric. */
            description: string;

            /** @ignore */
            period: string;

            /** @ignore */
            resolution: string;

            /** Returns the system of the metric. */
            system: System;

            /** Returns the repository of the metric. */
            repo: Repository;

            /** Returns the ID of the metric. */
            id: string;

            /** Returns the type of the metric. */
            type: number;

            /** An array of parent system names, starting with the root system name. */
            path: string[];

            /** @ignore */
            conflation: ConflationMode;

            /** Returns the value of the metric. */
            value: any;

            /** Updates the value of the metric. */
            update(value: any): void;

            /** Returns the value type of the metric. */
            getValueType(): void;
        }

        /** Address metric. */
        export interface AddressMetric extends Metric {

            /** Returns the value of the metric. */
            value: any;
        }

        /** Count metric. */
        export interface CountMetric extends Metric {

            /** Returns the value of the metric. */
            value: number;

            /**
             * Updates the value of the metric.
             * @param value Value with which to update the metric.
             */
            update(value: number): void;

            /**
             * Increments the value of the metric by the specified number.
             * @param num Number by which to increment the metric.
             */
            incrementBy(num: number): void;

            /** Increments the value of the metric by 1. */
            increment(): void;

            /** Decrements the value of the metric by 1. */
            decrement(): void;

            /**
             * Decrements the value of the metric by the specified number.
             * @param num Number by which to decrement the metric.
             */
            decrementBy(num: number): void;
        }

        /** Number metric. */
        export interface NumberMetric extends Metric {

            /** Returns the value of the metric. */
            value: number;

            /**
             * Updates the value of the metric.
             * @param value Value with which to update the metric.
             */
            update(value: number): void;

            /**
             * Increments the value of the metric by the specified number.
             * @param num Number by which to increment the metric.
             */
            incrementBy(num: number): void;

            /** Increments the value of the metric by 1. */
            increment(): void;

            /**  Decrements the value of the metric by 1 */
            decrement(): void;

            /**
             * Decrements the value of the metric by the specified number.
             * @param num Number by which to decrement the metric.
             */
            decrementBy(num: number): void;
        }

        /** Object metric. */
        export interface ObjectMetric extends Metric {

            /** Returns the value of the metric. */
            value: any;

            /**
             * Updates the value of the metric.
             * @param value Value with which to update the metric.
             */
            update(value: any): void;
        }

        /** Rate metric. */
        export interface RateMetric extends Metric {

            /** Returns the value of the metric. */
            value: number;

            /**
             * Updates the value of the metric.
             * @param value Value with which to update the metric.
             */
            update(value: number): void;
        }

        /** Statistics metric. */
        export interface StatisticsMetric extends Metric {

            /** Returns the value of the metric. */
            value: any;

            /**
             * Updates the value of the metric.
             * @param value Value with which to update the metric.
             */
            update(value: number): void;
        }

        /** String metric. */
        export interface StringMetric extends Metric {

            /** Returns the value of the metric. */
            value: string;

            /**
             * Updates the value of the metric.
             * @param value Value with which to update the metric.
             */
            update(value: string): void;
        }

        /** Timespan metric. */
        export interface TimespanMetric extends Metric {

            /** Returns the value of the metric. */
            value: any;

            /**
             * Updates the value of the metric.
             * @param value Value with which to update the metric.
             */
            update(value: string): void;

            /** Starts measuring the timespan. */
            start(): void;

            /** Stops measuring the timespan. */
            stop(): void;
        }

        /** Timestamp metric. */
        export interface TimestampMetric extends Metric {

            /** Returns the value of the metric. */
            value: any;

            /**
             * Updates the value of the metric.
             * @param value Value with which to update the metric.
             */
            update(value: string): void;

            /** Updates the metric with the current date and time. */
            now(): void;

        }

        /** Aggregate system state. */
        export interface SystemStateInfo extends State {

            /** Name of the metrics system. */
            name?: string;

            /** An array of parent system names, starting with the root system name. */
            path?: string[];
        }
    }

    /**
     * @docName Shared Contexts
     * @docmenuorder 2
     * @intro
     * A **Shared Context** is a named object (holding a `map` of `key`/`value` pairs) that stores cross application data. The context object can hold any desktop-wide or cross-application data. Any application can update a context or * subscribe for update notifications (by using the name of the context). Apps can also react to context changes (by subscribing for context updates) or update the context at runtime.
     *
     * The **Shared Contexts** API offers a simple and effective solution for sharing data between your applications. Imagine you have an application showing a list of clients and an application showing client portfolios. What you need, * is your "Portfolio" app to show the portfolio of a specific client that the user has selected from the "Clients" app. You can easily achieve this in a few simple steps by using the **Shared Contexts** API:
     *
     * - instruct the "Clients" app to publish updates to a context object, holding the `id` of the currently selected client;
     * - instruct the "Portfolio" app to subscribe for updates of that same context object and specify how the "Portfolio" app should handle the received data in order to update its current state;
     *
     * The **Shared Contexts** API can be accessed through the `glue.contexts` object.
     *
     * ![Shared Contexts](../../../../images/shared-contexts/shared-contexts.gif)
     *
     * See also the [**Shared Contexts**](../../../../glue42-concepts/data-sharing-between-apps/shared-contexts/javascript/index.html) documentation for more details.
     */
    export namespace Contexts {
        export interface API extends GlueInnerLib {
            /**
             * Returns all existing context names. Using the context name you can subscribe for context changes, updates or set context values.
             */
            all(): string[];

            /**
             * Updates a context with the supplied object. This method updates only the specified context properties. Any other existing context properties will remain intact.
             * If the context does not exist, the `update()` method will create it.
             *
             * @example
             * ```javascript
             * glue.contexts.update("app-styling",
             *    {
             *        backgroundColor: "red",
             *        alternativeColor: "green"
             *    });
             * ```
             * @param name Name of the context to be updated.
             * @param data The object that will be applied to the context.
             */
            update(name: string, data: any): Promise<void>;

            /**
             * Replaces a context. All properties of the specified context object will be removed and replaced with the ones supplied in the `data` parameter.
             * @param name Name of the context to be replaced.
             * @param data The object that will be applied to the context.
             */
            set(name: string, data: any): Promise<void>;

            /**
             * Subscribes for context events. Returns an unsubscribe function which you can use to stop receiving context updates.
             * @param name Name of the context to which you want to subscribe.
             * @param callback Function that will handle the updates.
             */
            subscribe(name: string, callback: (data: any, delta: any, removed: string[], unsubscribe: () => void, extraData?: any) => void): Promise<() => void>;

            /**
             * Return the context data immediately or asynchronously as soon as any data becomes available.
             * @param name Name of the context from which you want to get data.
             * @param resolveImmediately If `true` (default), resolves inexistent contexts with `undefined`.
             * Otherwise, subscribes to the context and resolves the `Promise` as soon as the context is created.
             */
            get(name: string, resolveImmediately?: boolean): Promise<any>;
        }

        /** @ignore */
        export interface ContextsConfig {
            connection: Glue42Core.Connection.API;

            logger: Glue42Core.Logger.API;

            gdMajorVersion: number;
        }

        /** Context delta when updating or replacing a context. */
        export interface ContextDelta {

            /** Context properties that were added. */
            added: ContextEntries;

            /** Context properties that were updated. */
            updated: ContextEntries;

            /** Context properties that were removed. */
            removed: string[];

            /** Context properties that were reset. */
            reset: ContextEntries;
        }

        /** Context entries. Key/value pairs holding context data. */
        export type ContextEntries = { [index: string]: any };

        export type ContextName = string;
        export type ContextSubscriptionKey = number;

    }

    /**
    * @docName Bus
    * @docmenuorder 3
    * @intro
    * The **Pub/Sub** API enables applications to:
    *
    * - publish messages on a specific topic;
    * - subscribe for messages on a specific topic;
    *
    * When an application publishes a message on a specific topic, the **Pub/Sub** API delivers it to other applications that have subscribed to that topic.
    *
    * The "raw Pub/Sub" support allows Glue42 Desktop to work with applications already using a Pub/Sub technology. Before writing new Pub/Sub based code, please consider the higher level [**Interop**](../../../../glue42-concepts/data-sharing-between-apps/interop/javascript/index.html) services provided by Glue42 Desktop: **Request/Response**, **Streaming**, **Discovery** and **Shared Contexts**. Utilizing these services, instead of creating them from scratch, can save you time and also provide you with a more robust service that can interact with applications by different dev teams and vendors.
    *
    * See also the [**Pub/Sub**](../../../../glue42-concepts/data-sharing-between-apps/pub-sub/javascript/index.html) documentation for more details.
    */
    export namespace Bus {
        export interface API extends GlueInnerLib {
            /**
             * Publishes the provided data on a specific topic.
             * An optional object can be provided to publish a message to specific peers.
             *
             * @example
             * ```javascript
             * glue.bus.publish("prices", { RIC: "VOD.L", price: 21.2 })
             * ```
             * @param topic Topic on which to publish the message.
             * @param data Data to publish.
             * @param options An optional object with message options.
             */
            publish(
                topic: string,
                data: object,
                options?: MessageOptions
            ): void

            /**
             * Subscribe for receiving data published on specific topic on the message bus. The provided callback will be invoked for each received message.
             * An optional object can be provided to receive messages published only by specific peers.
             *
             * Returns a `Promise` which resolves if the subscription is successful. The `Promise` resolves with a subscription object which can be used to unsubscribe and stop receiving messages.
             *
             * @example
             * ```javascript
             * glue.bus.subscribe(
             *     "prices",
             *     function (data, topic, source) {
             *         console.log(data, topic, source);
             *   })
             * ```
             * @param topic Topic to which to subscribe.
             * @param callback Function that will handle the received data.
             * @param options An optional object with message options.
             */
            subscribe(
                topic: string,
                callback: (data: object, topic: string, source: Glue42Core.AGM.Instance) => void,
                options?: MessageOptions
            ): Promise<Subscription>;
        }

        /**
         * If `routingKey` is provided when publishing a message, the message will be delivered only to peers that have provided the same routing key
         * or no routing key during subscription.
         * If `routingKey` is provided when subscribing for a topic, only messages that have been published with a matching routing key or no routing key
         * at all will be received by the subscriber.
         * If `target` is provided when publishing a message, the message will be delivered only to subscribers for which all properties of the target object
         * match the respective fields on the subscribers identity.
         * If `target` is provided when subscribing for a topic, the provided object will be compared to the identity of the publishers of the messages
         * and only if they match will the messages be received by the subscriber.
         */
        export interface MessageOptions {

            /** Routing key specified by the publisher/subscriber. */
            routingKey?: string,

            /** Target specified by the publisher/subscriber. */
            target?: object
        }

        /**
         * Subscription object that can be used to unsubscribe from a topic and stop receiving data.
         */
        export interface Subscription {
            unsubscribe: () => Promise<void>
        }

        /**
         * @ignore
         */
        export interface Settings {
            connection: Connection.API;
            logger: Logger.API;
        }
    }
}

declare module "glue42core" {
    export = Glue42Core;
}
