import { useState } from "react";
import {
  EMPTY_FORM,
  FormActions,
  Modal,
  ReservationFields,
  validateReservation,
} from "./ReservationFields";

export default function AddReservationForm({ onSubmit, onClose }) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Hapus error field yang sedang diperbaiki
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateReservation(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    onSubmit({
      ...values,
      borrower: values.borrower.trim(),
      purpose: values.purpose.trim(),
    });
  };

  return (
    <Modal title="Add Reservation" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <ReservationFields
          values={values}
          errors={errors}
          onChange={handleChange}
        />
        <FormActions onCancel={onClose} submitLabel="Simpan" />
      </form>
    </Modal>
  );
}