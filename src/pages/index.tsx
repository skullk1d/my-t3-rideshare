import { Collections } from "@prisma/client";
import { useContext, useRef, useState } from "react";
import CollapsibleCollection, {
  Props as CollapsibleCollectionProps,
} from "~/components/CollapsibleCollection";
import ToggleUser from "~/components/ToggleUser";
import { ActiveUserContext } from "~/context/ActiveUser";

import { api } from "~/utils/api";

export default function Home() {
  const [userIds, setUserIds] = useState<number[]>([]);
  const [collectionIds, setCollectionIds] = useState<number[]>([]);
  const [bidIds, setBidIds] = useState<number[]>([]);

  const fetchUsers = api.users.get.useQuery(userIds);
  const fetchCollections = api.collections.get.useQuery(collectionIds);
  const fetchBids = api.bids.get.useQuery(bidIds);

  const expandedCollectionIds = useRef<Set<number>>(new Set());

  const { activeUser, setActiveUser } = useContext(ActiveUserContext);

  // NOTE: Collections & Bids intersection assertion is congruent with Collections query payload
  const fetchCollectionsData = fetchCollections.data as Array<
    CollapsibleCollectionProps["collection"]
  >;

  const handleDeleteCollection = (res?: Collections) => {
    if (res) {
      fetchCollections.refetch();
    }
  };

  return (
    <div className="mx-auto p-8">
      <h4 className="mb-1 text-2xl font-bold">Login As User:</h4>

      <ToggleUser />

      <h4 className="mb-1 mt-4 text-2xl font-bold">Collections:</h4>

      <div className="mb-8">
        {fetchCollectionsData?.length &&
          fetchCollectionsData.map((collection) => (
            <CollapsibleCollection
              key={collection.id}
              collection={collection}
              isOpen={false}
              handleDeleteCollection={handleDeleteCollection}
            />
          ))}
      </div>
    </div>
  );
}
