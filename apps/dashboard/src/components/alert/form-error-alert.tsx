import { SharedAlertProps } from './models/shared-alert-props.model';
import ErrorAlert from './error-alert';

export const FormErrorAlert = ({ message }: SharedAlertProps) => <ErrorAlert className="p-2" message={message} />;

export default FormErrorAlert;
