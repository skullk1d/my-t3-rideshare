import React, { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { RowSpacingIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Bids, Collections } from "@prisma/client";
import { api } from "~/utils/api";

// NOTE: Manually intersected type to be like TRPQueryResult from relational query
type Props = {
  collection: Collections & { Bids: Array<Bids> };
  isOpen: boolean;
};

const CollapsableCollection = (props: Props) => {
  const { collection, isOpen } = props;

  const [open, setOpen] = useState(isOpen);
  const [isEditing, setIsEditing] = useState(true);
  const [inputName, setInputName] = useState(collection.name);
  const [inputDescription, setInputDescription] = useState(
    collection.description,
  );
  const [inputQuantity, setInputQuantity] = useState(
    collection.quantity_stocks,
  );

  const fetchCollections = api.collections.get.useQuery([collection.id]);

  const updateCollectionMutation = api.collections.update.useMutation();

  const handleUpdateCollection = async () => {
    try {
      await updateCollectionMutation.mutateAsync({
        id: collection.id,
        name: inputName,
        description: inputDescription,
        quantity_stocks: inputQuantity,
      });
      fetchCollections.refetch();

      handleCancelEdit();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);

    setInputName(collection.name);
    setInputDescription(collection.description);
    setInputQuantity(collection.quantity_stocks);
  };

  return (
    <Collapsible.Root
      className="CollapsibleRoot"
      open={open}
      onOpenChange={setOpen}
    >
      <div
        className="my-4 grid grid-cols-5 gap-4 rounded border border-gray-300 bg-white p-4 shadow"
        style={{
          display: "grid",
          justifyContent: "space-between",
          justifyItems: "stretch",
          alignContent: "center",
          alignItems: "cetner",
        }}
      >
        {isEditing ? (
          <input
            className="mr-2 border border-gray-300 p-2"
            placeholder="Name"
            value={inputName || ""}
            onChange={(e) => setInputName(String(e.target.value))}
          />
        ) : (
          <h3 className="Text" style={{ color: "black" }}>
            {collection.name}
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
            {collection.description}
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
            {collection.quantity_stocks}
          </h3>
        )}
        <div
          style={{
            justifySelf: "end",
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
              onClick={() => void 0}
            >
              Delete
            </button>
          )}
        </div>
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
        {collection.Bids.map((bid) => (
          <div
            key={bid.id}
            className="my-1 ml-[50px] grid grid-cols-3 gap-4 rounded border border-gray-300 bg-white p-4 shadow"
          >
            <div className="Repository">
              <span className="Text">{bid.price}</span>
            </div>
            <div className="Repository">
              <span className="Text">{bid.status}</span>
            </div>
          </div>
        ))}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default CollapsableCollection;
