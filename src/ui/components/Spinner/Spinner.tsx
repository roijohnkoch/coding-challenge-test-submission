import $ from "./Spinner.module.css";

const Spinner = () => {
  return (
    <div className={$.spinnerOverlay}>
      <div className={$.spinner} />
    </div>
  )
};

export default Spinner;