import { type Bids, type Collections } from '@prisma/client';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import React, { useContext, useState } from 'react';
import { ActiveUserContext } from '~/context/ActiveUser';
import { api } from '~/utils/api';

import styles from './BidDialog.module.css';

type Props = {
  currentCollection: Collections;
  handleCreateBid: (bid: Bids) => void;
};

const DialogDemo = (props: Props) => {
  const { currentCollection, handleCreateBid } = props;

  const { activeUser } = useContext(ActiveUserContext);

  const [price, setPrice] = useState(0.0);

  const createBidMutation = api.bids.create.useMutation();

  const handleChangePrice = (v: string) => setPrice(parseFloat(v));

  const handleSubmitBid = async () => {
    try {
      const res = await createBidMutation.mutateAsync({
        user_id: activeUser.id,
        collection_id: currentCollection.id,
        price,
        status: 'Pending',
      });
      setPrice(0.0);

      handleCreateBid(res);
    } catch (error) {
      console.log(error);
    }
  };

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
            {`${activeUser.name} bid for collection ${currentCollection.name}`}
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
              onChange={(e) => handleChangePrice(e.target.value)}
            />
          </fieldset>
          <div
            style={{
              display: 'flex',
              marginTop: 25,
              justifyContent: 'flex-end',
            }}
          >
            <Dialog.Close asChild>
              <button
                className="m-1 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                onClick={handleSubmitBid}
              >
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
