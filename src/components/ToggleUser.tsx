import { type User } from '@prisma/client';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import React, { useContext, useState } from 'react';
import { ActiveUserContext } from '~/context/ActiveUser';
import { api } from '~/utils/api';

import styles from './ToggleUser.module.css';

const ToggleUser = () => {
  const { activeUser, setActiveUser } = useContext(ActiveUserContext);

  const [currentUserId, setCurrentUserId] = useState(activeUser.id);

  const fetchUsers = api.users.get.useQuery();
  const fetchUser = api.users.get.useQuery([currentUserId]);

  const fetchUsersData = fetchUsers.data as Array<User>;

  const handleToggleUser = async (v: string) => {
    setCurrentUserId(parseInt(v));

    await fetchUser.refetch().then((res) => {
      setActiveUser(res.data as User);
    });
  };

  return (
    <ToggleGroup.Root
      className={styles.ToggleGroup + ' my-4'}
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

export default ToggleUser;
