declare const goldenConfig: {
    settings: {
        hasHeaders: boolean;
        reorderEnabled: boolean;
        selectionEnabled: boolean;
        suppressPopout: boolean;
    };
    dimensions: {
        headerHeight: number;
    };
    content: ({
        type: string;
        content: ({
            type: string;
            width: number;
            content: ({
                type: string;
                componentName: string;
                title: string;
                height?: undefined;
                content?: undefined;
            } | {
                type: string;
                height: number;
                content: {
                    type: string;
                    componentName: string;
                    title: string;
                }[];
                componentName?: undefined;
                title?: undefined;
            })[];
        } | {
            type: string;
            content: {
                type: string;
                content: {
                    type: string;
                    componentName: string;
                    title: string;
                }[];
            }[];
            width?: undefined;
        } | {
            type: string;
            width: number;
            content: ({
                type: string;
                content: {
                    type: string;
                    componentName: string;
                    title: string;
                }[];
                componentName?: undefined;
                title?: undefined;
            } | {
                type: string;
                componentName: string;
                title: string;
                content?: undefined;
            })[];
        })[];
        isClosable?: undefined;
        height?: undefined;
    } | {
        type: string;
        isClosable: boolean;
        height: number;
        content: ({
            type: string;
            componentName: string;
            title: string;
            content?: undefined;
        } | {
            type: string;
            content: {
                type: string;
                componentName: string;
                title: string;
            }[];
            componentName?: undefined;
            title?: undefined;
        })[];
    })[];
};
export default goldenConfig;
