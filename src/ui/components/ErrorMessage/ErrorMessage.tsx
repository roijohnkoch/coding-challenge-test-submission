import $ from './ErrorMessage.module.css';

interface ErrorMessageProps {
  error: string | undefined;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  return <div className={$.error}>{error}</div>;
};

export default ErrorMessage;