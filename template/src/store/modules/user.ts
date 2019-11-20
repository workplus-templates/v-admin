import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule
} from 'vuex-module-decorators'
import { login, logout, getUserInfo } from '@/api/users'
import { getToken, setToken, removeToken } from '@/utils/cookies'
import store from '@/store'

export interface IUserState {
  token: string;
  name: string;
  avatar: string;
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || '';

  public name = '';

  public avatar = '';

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Action
  public async Login(userInfo: { username: string; password: string }) {
    let { username, password } = userInfo
    username = username.trim()
    const { data } = await login({ username, password })
    setToken(data.accessToken)
    this.SET_TOKEN(data.accessToken)
  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
  }

  @Action
  public async GetUserInfo() {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    const { data } = await getUserInfo({
      /* Your params here */
    })
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }
    const { name, avatar } = data.user
    this.SET_NAME(name)
    this.SET_AVATAR(avatar)
  }

  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    await logout()
    removeToken()
    this.SET_TOKEN('')
  }
}

export const UserModule = getModule(User)
