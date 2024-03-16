import { Users } from "@prisma/client";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import users from "~/server/api/routers/users";
import { api } from "~/utils/api";

const defaultUser: Users = {
  id: 1,
  name: "",
  email: "",
};

export const ActiveUserContext = createContext<{
  activeUser: Users;
  setActiveUser: Dispatch<SetStateAction<Users>>;
}>({
  activeUser: defaultUser,
  setActiveUser: () => void 0,
});

const ActiveUserWrapper = ({ children }) => {
  // ASSUMPTION: At least one user exists
  const fetchUsers = api.users.get.useQuery([1]);

  const [activeUser, setActiveUser] = useState(
    (fetchUsers.data as Users) ?? defaultUser,
  );

  return (
    <ActiveUserContext.Provider value={{ activeUser, setActiveUser }}>
      {children}
    </ActiveUserContext.Provider>
  );
};

export default ActiveUserWrapper;
