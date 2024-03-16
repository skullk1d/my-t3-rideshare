import React, { useContext, useState } from "react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { api } from "~/utils/api";
import { Users } from "@prisma/client";
import styles from "./ToggleUser.module.css";
import { ActiveUserContext } from "~/context/ActiveUser";

const ToggleGroupDemo = () => {
  const { activeUser, setActiveUser } = useContext(ActiveUserContext);

  const [currentUserId, setCurrentUserId] = useState(activeUser.id);

  const fetchUsers = api.users.get.useQuery();
  const fetchUser = api.users.get.useQuery([currentUserId]);

  const fetchUsersData = fetchUsers.data as Array<Users>;

  const handleToggleUser = (v: string) => {
    setCurrentUserId(parseInt(v));

    fetchUser.refetch().then((res) => {
      setActiveUser(res.data as Users);
    });
  };

  return (
    <ToggleGroup.Root
      className={styles.ToggleGroup + " my-4"}
      type="single"
      defaultValue={String(activeUser.id)}
      aria-label="Text alignment"
      onValueChange={handleToggleUser}
    >
      {fetchUsersData?.length &&
        fetchUsersData.map((user) => (
          <ToggleGroup.Item
            key={user.id}
            className={styles.ToggleGroupItem}
            value={String(user.id)}
            aria-label="Left aligned"
          >
            {`${user.id} (${user.name})`}
          </ToggleGroup.Item>
        ))}
    </ToggleGroup.Root>
  );
};

export default ToggleGroupDemo;
