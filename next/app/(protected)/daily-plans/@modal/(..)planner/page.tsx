import { Modal } from "@/components/dialogs/Modal";
import { FormDailyPlan } from "@/components/forms/FormDailyPlan";

export default async function Page() {
  return (
    <Modal>
      <FormDailyPlan />
    </Modal>
  );
}
