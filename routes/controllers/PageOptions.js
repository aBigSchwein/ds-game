import { domain } from '../../config.js';

const PageOptions = (path, page) => {
    const options = {
        page: {
            url: `${domain}${path}`,
            domain: domain,
            path: path,
            page: page,
            title: 'DS GAME | ',
            description: 'This game is built with nodeJS+socket.io for words',
            image: `${domain}/img/logo.png`,
            site_name: 'DS Game',
            keywords: 'DS Game,Game,Codenames,Words,SocketIO'
        }
    };
    switch (path) {
        case '/':
            options.page.title = `${options.page.title} Player`;
            break;
        case '/host':
            options.page.title = `${options.page.title} Host`;
            break;
        default:
            options.page.title = `${options.page.title} Error`;
    }
    return options;
};

export default PageOptions;