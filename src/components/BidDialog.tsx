import React, { useContext } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import styles from "./BidDialog.module.css";
import { api } from "~/utils/api";
import { Collections, Users } from "@prisma/client";
import { ActiveUserContext } from "~/context/ActiveUser";

type Props = {
  currentCollection: Collections;
};

const DialogDemo = (props: Props) => {
  const { currentCollection } = props;

  const { activeUser } = useContext(ActiveUserContext);

  const createBidMutation = api.bids.create.useMutation();

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="m-1 rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600">
          Bid
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.DialogOverlay} />
        <Dialog.Content className={styles.DialogContent}>
          <Dialog.Title className={styles.DialogTitle}>
            {activeUser.name}
          </Dialog.Title>
          <fieldset className={styles.Fieldset}>
            <label className={styles.Label} htmlFor="name">
              Price
            </label>
            <input
              className="mr-2 border border-gray-300 p-2"
              id="name"
              defaultValue="0.00"
              type="number"
              min={0}
              max={999}
              step={0.01}
            />
          </fieldset>
          <div
            style={{
              display: "flex",
              marginTop: 25,
              justifyContent: "flex-end",
            }}
          >
            <Dialog.Close asChild>
              <button className="m-1 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                Submit
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button className={styles.IconButton} aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DialogDemo;
