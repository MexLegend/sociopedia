import { FC, useEffect, useRef, useState } from "react"

interface Props {
    children: React.ReactNode,
    uploadPreset: string;
    options: any;
    onUpload: Function;
    disabled?: boolean;
}

const UploadWidget: FC<Props> = ({ children, options, uploadPreset, onUpload, disabled }) => {

    const [cloudinary, setCloudinary] = useState<any>();
    const [widget, setWidget] = useState<any>();

    useEffect(() => {
        // Store the Cloudinary window instance to a ref when the page renders

        if (!cloudinary) {
            setCloudinary(window.cloudinary);
        }

        function onIdle() {
            if (!widget) {
                setWidget(createWidget());
            }
        }

        'requestIdleCallback' in window ? requestIdleCallback(onIdle) : setTimeout(onIdle, 1);

        // eslint-disable-next-line
    }, []);

    /**
     * createWidget
     * @description Creates a new instance of the Cloudinary widget and stores in a ref
     */

    const createWidget = () => {
        // Providing only a Cloud Name along with an Upload Preset allows you to use the
        // widget without requiring an API Key or Secret. This however allows for
        // "unsigned" uploads which may allow for more usage than intended. Read more
        // about unsigned uploads at: https://cloudinary.com/documentation/upload_images#unsigned_upload

        const widgetOptions: any = {
            ...options,
            cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
            uploadPreset
        }

        return cloudinary?.createUploadWidget(widgetOptions,
            function (error: any, result: any) {
                // The callback is a bit more chatty than failed or success so
                // only trigger when one of those are the case. You can additionally
                // create a separate handler such as onEvent and trigger it on
                // ever occurance
                if (error || result.event === 'success') {
                    onUpload(error, result, widget);
                }
            }
        );
    }

    /**
     * open
     * @description When triggered, uses the current widget instance to open the upload modal
     */

    const open = () => {

        if (!widget) {
            const widget = createWidget();
            setWidget(widget);
            widget.open();
            return;
        }

        widget && widget.open();
    }

    return (
        <div onClick={open} style={{ pointerEvents: disabled ? 'none' : 'auto' }}>
            {children}
        </div>
    )
}

export default UploadWidget;