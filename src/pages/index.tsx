import { Collections } from "@prisma/client";
import { useContext, useRef, useState } from "react";
import CollapsableCollection, {
  Props as CollapsableCollectionProps,
} from "~/components/CollapsableCollection";
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
    CollapsableCollectionProps["collection"]
  >;

  return (
    <div className="mx-auto p-8">
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Users</h2>
      </div>
      <button
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={() => fetchUsers.refetch()}
      >
        Get All Users
      </button>

      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Collections</h2>
      </div>
      <button
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={() => fetchCollections.refetch()}
      >
        Get All Collections
      </button>

      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Bids</h2>
      </div>
      <button
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={() => fetchBids.refetch()}
      >
        Get All Bids
      </button>

      <div className="mb-8">
        {fetchCollectionsData?.length &&
          fetchCollectionsData.map((collection) => (
            <CollapsableCollection
              key={collection.id}
              collection={collection}
              isOpen={true}
            />
          ))}
      </div>
    </div>
  );
}
