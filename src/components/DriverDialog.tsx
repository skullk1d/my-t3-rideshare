import { type Driver, type Ride } from '@prisma/client';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import React, { useContext, useState } from 'react';
import { ActiveUserContext } from '~/context/ActiveUser';
import { api } from '~/utils/api';

import styles from './DriverDialog.module.css';

type Props = {
  currentRide: Ride;
  handleCreateDriver: (driver: Driver) => void;
};

const DialogDemo = (props: Props) => {
  const { currentRide, handleCreateDriver } = props;

  const { activeUser } = useContext(ActiveUserContext);

  const [price, setPrice] = useState(0.0);
  const [distance, setDistance] = useState(0.0);
  const [carModel, setCarModel] = useState('');

  const createDriverMutation = api.drivers.create.useMutation();

  const handleChangePrice = (v: string) => setPrice(parseFloat(v));
  const handleChangeDistance = (v: string) => setDistance(parseFloat(v));

  const handleSubmitDriver = async () => {
    try {
      const res = await createDriverMutation.mutateAsync({
        user_id: activeUser.id,
        ride_id: currentRide.id,
        distance,
        price,
        car_model: carModel,
        status: 'Pending',
      });
      setDistance(0.0);

      handleCreateDriver(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="m-1 rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600">
          Driver
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.DialogOverlay} />
        <Dialog.Content className={styles.DialogContent}>
          <Dialog.Title className={styles.DialogTitle}>
            {`${activeUser.name} driver for ride ${currentRide.app_name}`}
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
          <fieldset className={styles.Fieldset}>
            <label className={styles.Label} htmlFor="name">
              Distance from passenger
            </label>
            <input
              className="mr-2 border border-gray-300 p-2"
              id="name"
              defaultValue="0.00"
              type="number"
              min={0}
              max={999}
              step={0.01}
              onChange={(e) => handleChangeDistance(e.target.value)}
            />
          </fieldset>
          <fieldset className={styles.Fieldset}>
            <label className={styles.Label} htmlFor="name">
              Car model
            </label>
            <input
              className="mr-2 border border-gray-300 p-2"
              id="name"
              defaultValue="Civic"
              type="text"
              onChange={(e) => handleChangeDistance(e.target.value)}
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
                onClick={handleSubmitDriver}
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
