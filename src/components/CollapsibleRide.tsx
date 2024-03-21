import { type Driver, type Ride } from '@prisma/client';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Cross2Icon, RowSpacingIcon } from '@radix-ui/react-icons';
import React, { useContext, useState } from 'react';
import { z } from 'zod';
import { ActiveUserContext } from '~/context/ActiveUser';
import { api } from '~/utils/api';

import styles from './CollapsibleRide.module.css';
import DriverDialog from './DriverDialog';

// NOTE: Manually intersected type to be like TRPQueryResult from relational query
export type Props = {
  ride: Ride & { Driver: Array<Driver> };
  isOpen: boolean;
  handleDeleteRide: (ride?: Ride) => void;
};

const CollapsibleRide = (props: Props) => {
  const { ride, isOpen, handleDeleteRide } = props;

  const { activeUser } = useContext(ActiveUserContext);

  const [currentRide, setCurrentRide] = useState(ride);
  const [open, setOpen] = useState(isOpen);
  const [isEditing, setIsEditing] = useState(false);
  const [inputName, setInputName] = useState(currentRide.app_name);
  const [inputAddress, setInputAddress] = useState(currentRide.address);
  const [inputQuantity, setInputQuantity] = useState(currentRide.quantity_passengers);

  const fetchRides = api.rides.get.useQuery([currentRide.id]);
  const fetchRideDriver = api.rides.getDriver.useQuery(currentRide.id);

  const updateRideMutation = api.rides.update.useMutation();
  const deleteRidesMutation = api.rides.delete.useMutation();
  const deleteDriverMutation = api.drivers.delete.useMutation();
  const acceptDriverMutation = api.drivers.accept.useMutation();
  const rejectDriverMutation = api.drivers.reject.useMutation();

  const isRideOwner = activeUser.id === currentRide.user_id;

  const handleCancelEdit = () => {
    setIsEditing(false);

    setInputName(currentRide.app_name);
    setInputAddress(currentRide.address);
    setInputQuantity(currentRide.quantity_passengers);
  };

  const handleConfirmEdit = (resultRide: Ride) => {
    setCurrentRide({
      ...ride,
      ...resultRide,
    });
    handleCancelEdit();
  };

  const handleUpdateRide = async () => {
    try {
      await updateRideMutation
        .mutateAsync({
          id: currentRide.id,
          requested_at: z.date().parse(Date.now()),
          app_name: inputName,
          address: inputAddress,
          quantity_passengers: inputQuantity,
        })
        .then(handleConfirmEdit);

      await fetchRides.refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickDeleteRide = async () => {
    try {
      const res = (await deleteRidesMutation.mutateAsync([currentRide.id])) as Ride;

      await fetchRides.refetch();

      handleDeleteRide(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickDeleteDriver = async (driverId: number) => {
    try {
      await deleteDriverMutation.mutateAsync([driverId]);

      await fetchRideDriver.refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickAcceptDriver = async (driverId: number) => {
    try {
      await acceptDriverMutation.mutateAsync(driverId);

      await fetchRideDriver.refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickRejectDriver = async (driverId: number) => {
    try {
      await rejectDriverMutation.mutateAsync(driverId);

      await fetchRideDriver.refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateDriver = async () => {
    await fetchRideDriver.refetch();
  };

  return (
    <Collapsible.Root className="CollapsibleRoot" open={open} onOpenChange={setOpen}>
      <div
        className="my-4 grid grid-cols-7 gap-4 rounded border border-gray-300 bg-white p-4 shadow"
        style={{
          display: 'grid',
          justifyContent: 'space-between',
          justifyItems: 'stretch',
          alignContent: 'center',
          alignItems: 'center',
        }}
      >
        <h3 className="Text" style={{ color: 'black' }}>
          {`User: (${currentRide.user_id})`}
        </h3>
        <h3 className="Text" style={{ color: 'black' }}>
          <label>Requested on:</label>
          {currentRide.requested_at.toLocaleString()}
        </h3>
        <h3 className="Text" style={{ color: 'black' }}>
          <label>Vendor:</label>
          {currentRide.app_name}
        </h3>
        {isEditing ? (
          <input
            className="mr-2 border border-gray-300 p-2"
            placeholder="Address"
            value={inputAddress || ''}
            onChange={(e) => setInputAddress(String(e.target.value))}
          />
        ) : (
          <h3 className="Text" style={{ color: 'black' }}>
            <label>Address: </label>
            {currentRide.address}
          </h3>
        )}
        {isEditing ? (
          <input
            className="mr-2 border border-gray-300 p-2"
            placeholder="Passengers"
            value={inputQuantity || ''}
            onChange={(e) => setInputQuantity(Number(e.target.value))}
          />
        ) : (
          <h3 className="Text" style={{ color: 'black' }}>
            <label>Quantity: </label>
            {currentRide.quantity_passengers}
          </h3>
        )}

        {/* Action buttons */}

        {isRideOwner ? (
          <div>
            {isEditing ? (
              <button
                className="m-1 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                onClick={handleUpdateRide}
              >
                UPDATE
              </button>
            ) : (
              <button
                className="m-1 rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            )}
            {isEditing ? (
              <button
                className="m14 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            ) : (
              <button
                className="m14 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                onClick={handleClickDeleteRide}
              >
                Delete
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              justifySelf: 'end',
            }}
          >
            <DriverDialog currentRide={currentRide} handleCreateDriver={handleCreateDriver} />
          </div>
        )}
        <Collapsible.Trigger
          asChild
          style={{
            justifySelf: 'end',
          }}
        >
          <button className="IconButton">{open ? <Cross2Icon /> : <RowSpacingIcon />}</button>
        </Collapsible.Trigger>
      </div>

      <Collapsible.Content>
        {/* Sneaky sneaky filtering & sorting */}
        {fetchRideDriver.data?.Driver.length &&
          fetchRideDriver.data.Driver.sort((a, b) => b.price - a.price)
            .filter((driver) => driver.user_id !== currentRide.user_id)
            .map((driver) => (
              <div
                key={driver.id}
                className="my-1 ml-[50px] grid grid-cols-4 gap-4 rounded border border-gray-300 bg-white p-4 shadow"
              >
                <div>
                  <span className="Text">
                    <label>Buyer: </label>
                    {driver.user_id}
                  </span>
                </div>
                <div>
                  <span className="Text">
                    <label>Price: </label>
                    {driver.price}
                  </span>
                </div>
                <div>
                  <span className="Text">
                    <label>Status: </label>
                    {driver.status}
                  </span>
                </div>
                {activeUser.id === driver.user_id ? (
                  <div
                    style={{
                      justifySelf: 'end',
                    }}
                  >
                    <button
                      className="m14 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                      onClick={() => handleClickDeleteDriver(driver.id)}
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
                {isRideOwner && driver.status === 'Pending' ? (
                  <div className={styles.AcceptRejectButtonGroup}>
                    <div className={styles.AcceptRejectButton}>
                      <button
                        className="accept-reject-btn m14 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                        onClick={() => handleClickAcceptDriver(driver.id)}
                      >
                        Accept
                      </button>
                    </div>
                    <div className={styles.AcceptRejectButton}>
                      <button
                        className={
                          'accept-reject-btn m14 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 ' +
                          styles.AcceptRejectButton
                        }
                        onClick={() => handleClickRejectDriver(driver.id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default CollapsibleRide;
