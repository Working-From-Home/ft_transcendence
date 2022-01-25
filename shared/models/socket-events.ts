// doc:
// https://socket.io/docs/v4/typescript/
// https://stackoverflow.com/questions/10058226/send-response-to-all-clients-except-sender
// https://stackoverflow.com/questions/38506952/how-to-send-response-back-to-client-using-socket-io
// https://socket.io/docs/v4/emitting-events/#acknowledgements

export interface ISearchChannel
{
	id: number;
	title: string;
}

export interface ServerToClientEvents {

}

export interface ClientToServerEvents {
  searchChannel: (title: string, callback: (channels: ISearchChannel[]) => void ) => void;
}

export interface InterServerEvents {}

export interface SocketData {}


//// Sharing types between front and back problem :
//
// https://www.google.com/search?q=typescript+shared+types+between+front+back+docker+compose
// https://blog.bitsrc.io/stay-in-sync-share-typescript-types-between-seperate-repositories-3d7850a68fef
// https://www.google.com/search?q=typescript+shared+models++between+front+back
// https://www.reddit.com/r/typescript/comments/b9gz4c/best_practices_for_sharing_types_between_frontend/
// https://blog.bitsrc.io/stay-in-sync-share-typescript-types-between-seperate-repositories-3d7850a68fef
//
// a good lecture -> https://jczacharia.medium.com/the-type-safe-full-stack-angular-nestjs-nx-9bfd26142174
// second good one -> https://blog.bitsrc.io/sharing-types-between-backend-and-frontend-with-the-bff-pattern-553872842463
// exact pb -> https://www.reddit.com/r/typescript/comments/e9qsg2/shared_codetypes_between_frontend_and_nodejs/
// https://stackoverflow.com/questions/58801133/typescript-frontend-and-backend-build-with-shared-folder
// https://www.google.com/search?q=nestjs+monorepo+angular+shared
// https://github.com/emjimadhu/monorepify
// https://stackoverflow.com/questions/69323094/share-type-definition-of-frontend-and-backend
//
// https://www.reddit.com/r/typescript/comments/c4jfbp/best_way_to_use_common_types_across_monorepo/
// https://www.toptal.com/front-end/guide-to-monorepos
//
// let's try this (method 1 - local package) -> https://reverentgeek.com/3-ways-to-share-nodejs-modules-across-multiple-projects/
// https://stackoverflow.com/questions/64519937/substituting-the-npm-links-for-docker-container-case-with-node-js-node12-4-a
// another good lecture -> https://blog.bitsrc.io/a-better-way-to-share-code-between-your-node-js-projects-af6fbadc3102
// another one -> https://tomasvotruba.com/blog/2018/11/19/when-you-should-use-monorepo-and-when-local-packages/
//
//
// npm link :
// https://medium.com/@alexishevia/the-magic-behind-npm-link-d94dcb3a81af
// https://stackoverflow.com/questions/28664866/npm-link-save-does-not-update-dependencies-on-my-package-json
//
// typescript lib:
// https://aganglada.com/blog/how-to-create-your-own-typescript-library
// https://stackoverflow.com/questions/58462570/how-to-use-npm-link-with-a-module-written-using-typescript-for-development
// interface only module
// https://stackoverflow.com/questions/66529067/sharing-typescript-type-declarations-via-npm-package
//
// npm pkg entrypoint:
// https://stackoverflow.com/questions/22512992/how-to-use-the-main-parameter-in-package-json
// https://stackoverflow.com/questions/53083954/is-the-main-key-in-package-json-mandatory
// https://stackoverflow.com/questions/63058081/package-json-with-multiple-entrypoints
//
////
