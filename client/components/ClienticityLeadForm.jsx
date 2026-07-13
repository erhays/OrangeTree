import { useClienticityScript } from './useClienticityScript';

export default function ClienticityLeadForm() {
    useClienticityScript();

    return (
        <iframe
            src="https://link.clienticity.com/widget/form/bA8jIMZDoDXt0QU44NYr"
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: 0 }}
            id="inline-bA8jIMZDoDXt0QU44NYr"
            data-layout="{'id':'INLINE'}"
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name=" New Customer Inquiry Form"
            data-height="931"
            data-layout-iframe-id="inline-bA8jIMZDoDXt0QU44NYr"
            data-form-id="bA8jIMZDoDXt0QU44NYr"
            title="New Customer Inquiry Form"
        />
    );
}
