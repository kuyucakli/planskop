interface EmailTemplateProps {
    userName: string;
    title: string,
    dt: string
}

const ActionPlanEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    userName,
    title,
    dt
}) => (
    <div>
        <h1>Welcome, {userName}!</h1>
        <p> {`Your action titled: ${title} is on the way on ${dt}. Take care. We love you.`}</p>
    </div>
);


export { ActionPlanEmailTemplate };