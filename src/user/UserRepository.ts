import User from "./User";
//@ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { getItem, setItem } from "../utils/storage";
import { Logger } from "../main";

export default class UserRepository {
  getOrCreateGuestUser(): User {
    if (!this.isUserCreated()) {
      this.createGuestUser()
    }
    return this.getUser();
  }

  createGuestUser() {
    let guest = new User()
    guest.hash = uuidv4()
    guest.name = "Guest" + guest.hash.substring(0, 6)
    this.setUser(guest);
  }

  setUser(user: User) {
    setItem("user", user)
  }

  getUser(): User {
    let user: User = null
    try {
      user = getItem<User>("user");
    } catch (e) {
      Logger.error('Não foi possível obter o usuário da base')
    }
    return user
  }

  isUserCreated() {
    return this.getUser() != null
  }

}
