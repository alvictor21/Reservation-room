import { useState } from "react";
import {
  FormActions,
  Modal,
  ReservationFields,
  validateReservation,
} from "./ReservationFields";

export default function EditReservationForm({ room, onSubmit, onClose }) {
  // Field otomatis terisi dari data yang dipilih
  const [values, setValues] = useState({
    borrower: room.borrower,
    room: room.room,
    date: room.date,
    startTime: room.startTime,
    endTime: room.endTime,
    purpose: room.purpose,
    status: room.status,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateReservation(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    onSubmit(room.id, {
      ...values,
      borrower: values.borrower.trim(),
      purpose: values.purpose.trim(),
    });
  };

  return (
    <Modal title="Edit Reservation" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <ReservationFields
          values={values}
          errors={errors}
          onChange={handleChange}
        />
        <FormActions onCancel={onClose} submitLabel="Simpan Perubahan" />
      </form>
    </Modal>
  );
}