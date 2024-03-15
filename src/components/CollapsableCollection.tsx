import React from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { RowSpacingIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Bids, Collections } from "@prisma/client";

// NOTE: Manually intersected type to be like TRPQueryResult from relational query
type Props = {
  collection: Collections & { Bids: Array<Bids> };
  isOpen: boolean;
};

const CollapsableCollection = (props: Props) => {
  const { collection, isOpen } = props;

  const [open, setOpen] = React.useState(isOpen);

  return (
    <Collapsible.Root
      className="CollapsibleRoot"
      open={open}
      onOpenChange={setOpen}
    >
      <div
        className="my-4 grid grid-cols-4 gap-4 rounded border border-gray-300 bg-white p-4 shadow"
        style={{
          display: "grid",
          justifyContent: "space-between",
          justifyItems: "stretch",
          alignContent: "center",
          alignItems: "cetner",
        }}
      >
        <h3 className="Text" style={{ color: "black" }}>
          {collection.name}
        </h3>
        <span className="Text" style={{ color: "black" }}>
          {collection.description}
        </span>
        <div
          style={{
            justifySelf: "end",
          }}
        >
          <button
            className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
            onClick={() => void 0}
          >
            Edit
          </button>
          <button
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            onClick={() => void 0}
          >
            Delete
          </button>
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
