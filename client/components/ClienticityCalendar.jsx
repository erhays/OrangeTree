import { useClienticityScript } from './useClienticityScript';

export default function ClienticityCalendar() {
    useClienticityScript();

    return (
        <iframe
            src="https://link.clienticity.com/widget/booking/X3OO0iXujVX8QxDZ33qp"
            className="home-calendar-iframe"
            scrolling="no"
            id="X3OO0iXujVX8QxDZ33qp_1783535135717"
            title="Consultation Calendar"
        />
    );
}
