import Head from "next/head";
import Link from "next/link";
import { useCallback, useState } from "react";

import { api } from "~/utils/api";

export default function Home() {
  const [userIds, setUserIds] = useState<number[]>([]);
  const [collectionIds, setCollectionIds] = useState<number[]>([]);
  const [bidIds, setBidIds] = useState<number[]>([]);

  const fetchUsers = api.users.get.useQuery(userIds);
  const fetchCollections = api.collections.get.useQuery(collectionIds);
  const fetchBids = api.bids.get.useQuery(bidIds);

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
    </div>
  );
}
