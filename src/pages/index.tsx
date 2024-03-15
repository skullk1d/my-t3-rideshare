import Head from "next/head";
import Link from "next/link";
import { useCallback, useState } from "react";

import { api } from "~/utils/api";

export default function Home() {
  const [userIds, setUserIds] = useState<number[]>([]);

  const fetchUsers = api.users.get.useQuery(userIds);

  return (
    <div className="mx-auto p-8">
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Get All Users</h2>
      </div>
      <button
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={() => fetchUsers.refetch()}
      >
        Get All Users
      </button>
    </div>
  );
}
