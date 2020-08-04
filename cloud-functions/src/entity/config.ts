export interface IConfig {
    firebase: {
        [key: string]: string
    },
    user: {
        email: string;
        password: string;
    }
}
