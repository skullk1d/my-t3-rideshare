import React from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { RowSpacingIcon, Cross2Icon } from "@radix-ui/react-icons";
import "./styles.css";
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
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3 className="Text" style={{ color: "black" }}>
          {collection.name}
        </h3>
        <span className="Text" style={{ color: "black" }}>
          {collection.description}
        </span>
        <Collapsible.Trigger asChild>
          <button className="IconButton">
            {open ? <Cross2Icon /> : <RowSpacingIcon />}
          </button>
        </Collapsible.Trigger>
      </div>

      <div className="Repository">
        <span className="Text">@radix-ui/primitives</span>
      </div>

      <Collapsible.Content>
        {collection.Bids.map((bid) => (
          <div key={bid.id}>
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
