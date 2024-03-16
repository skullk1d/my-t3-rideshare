import React, { useContext, useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { RowSpacingIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Bids, Collections } from "@prisma/client";
import { api } from "~/utils/api";
import BidDialog from "./BidDialog";
import { ActiveUserContext } from "~/context/ActiveUser";

// NOTE: Manually intersected type to be like TRPQueryResult from relational query
export type Props = {
  collection: Collections & { Bids: Array<Bids> };
  isOpen: boolean;
  handleDeleteCollection: (collection?: Collections) => void;
};

const CollapsableCollection = (props: Props) => {
  const { collection, isOpen, handleDeleteCollection } = props;

  const { activeUser } = useContext(ActiveUserContext);

  const [currentCollection, setCurrentCollection] = useState(collection);
  const [open, setOpen] = useState(isOpen);
  const [isEditing, setIsEditing] = useState(false);
  const [inputName, setInputName] = useState(currentCollection.name);
  const [inputDescription, setInputDescription] = useState(
    currentCollection.description,
  );
  const [inputQuantity, setInputQuantity] = useState(
    currentCollection.quantity_stocks,
  );
  const [inputPrice, setInputPrice] = useState(currentCollection.price);

  const fetchCollections = api.collections.get.useQuery([currentCollection.id]);
  const fetchCollectionBids = api.collections.getBids.useQuery(
    currentCollection.id,
  );

  const updateCollectionMutation = api.collections.update.useMutation();
  const deleteCollectionsMutation = api.collections.delete.useMutation();

  const isOwner = activeUser.id === currentCollection.user_id;

  const handleCancelEdit = () => {
    setIsEditing(false);

    setInputName(currentCollection.name);
    setInputDescription(currentCollection.description);
    setInputQuantity(currentCollection.quantity_stocks);
    setInputPrice(currentCollection.price);
  };

  const handleConfirmEdit = (resultCollection: Collections) => {
    setCurrentCollection({
      ...collection,
      ...resultCollection,
    });
    handleCancelEdit();
  };

  const handleUpdateCollection = async () => {
    try {
      updateCollectionMutation
        .mutateAsync({
          id: currentCollection.id,
          name: inputName,
          description: inputDescription,
          quantity_stocks: inputQuantity,
          price: inputPrice,
        })
        .then(handleConfirmEdit);

      fetchCollections.refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickDelete = async () => {
    try {
      const res = (await deleteCollectionsMutation.mutateAsync([
        currentCollection.id,
      ])) as Collections;

      await fetchCollections.refetch();

      handleDeleteCollection(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateBid = () => {
    fetchCollectionBids.refetch();
  };

  return (
    <Collapsible.Root
      className="CollapsibleRoot"
      open={open}
      onOpenChange={setOpen}
    >
      <div
        className="my-4 grid grid-cols-7 gap-4 rounded border border-gray-300 bg-white p-4 shadow"
        style={{
          display: "grid",
          justifyContent: "space-between",
          justifyItems: "stretch",
          alignContent: "center",
          alignItems: "cetner",
        }}
      >
        <h3 className="Text" style={{ color: "black" }}>
          <label>Seller: </label>
          {currentCollection.user_id}
        </h3>
        {isEditing ? (
          <input
            className="mr-2 border border-gray-300 p-2"
            placeholder="Name"
            value={inputName || ""}
            onChange={(e) => setInputName(String(e.target.value))}
          />
        ) : (
          <h3 className="Text" style={{ color: "black" }}>
            <label>Name: </label>
            {currentCollection.name}
          </h3>
        )}
        {isEditing ? (
          <input
            className="mr-2 border border-gray-300 p-2"
            placeholder="Description"
            value={inputDescription || ""}
            onChange={(e) => setInputDescription(String(e.target.value))}
          />
        ) : (
          <h3 className="Text" style={{ color: "black" }}>
            <label>Description: </label>
            {currentCollection.description}
          </h3>
        )}
        {isEditing ? (
          <input
            className="mr-2 border border-gray-300 p-2"
            placeholder="Qauntity"
            value={inputQuantity || ""}
            onChange={(e) => setInputQuantity(Number(e.target.value))}
          />
        ) : (
          <h3 className="Text" style={{ color: "black" }}>
            <label>Quantity: </label>
            {currentCollection.quantity_stocks}
          </h3>
        )}
        {isEditing ? (
          <input
            className="mr-2 border border-gray-300 p-2"
            placeholder="Price"
            value={inputPrice || ""}
            onChange={(e) => setInputPrice(Number(e.target.value))}
          />
        ) : (
          <h3 className="Text" style={{ color: "black" }}>
            <label>Price: </label>
            {currentCollection.price}
          </h3>
        )}

        {/* Action buttons */}

        {isOwner ? (
          <div
            style={{
              justifySelf: "end",
              width: "200px",
            }}
          >
            {isEditing ? (
              <button
                className="m-1 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                onClick={handleUpdateCollection}
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
                onClick={handleClickDelete}
              >
                Delete
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              justifySelf: "end",
            }}
          >
            <BidDialog
              currentCollection={currentCollection}
              handleCreateBid={handleCreateBid}
            />
          </div>
        )}
        <Collapsible.Trigger
          asChild
          style={{
            justifySelf: "end",
          }}
        >
          <button className="IconButton">
            {open ? <Cross2Icon /> : <RowSpacingIcon />}
          </button>
        </Collapsible.Trigger>
      </div>

      <Collapsible.Content>
        {/* Sneaky sneaky filtering & sorting */}
        {fetchCollectionBids.data?.Bids.length &&
          fetchCollectionBids.data.Bids.sort((a, b) => b.price - a.price)
            .filter((bid) => bid.user_id !== currentCollection.user_id)
            .map((bid) => (
              <div
                key={bid.id}
                className="my-1 ml-[50px] grid grid-cols-3 gap-4 rounded border border-gray-300 bg-white p-4 shadow"
              >
                <div>
                  <span className="Text">
                    <label>Buyer: </label>
                    {bid.user_id}
                  </span>
                </div>
                <div>
                  <span className="Text">
                    <label>Price: </label>
                    {bid.price}
                  </span>
                </div>
                <div>
                  <span className="Text">
                    <label>Status: </label>
                    {bid.status}
                  </span>
                </div>
              </div>
            ))}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default CollapsableCollection;
