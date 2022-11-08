import Logging from '../../logging.js';
import PageOptions from './PageOptions.js';

const Home = async (req, res) => {
    Logging('INFO', 'Player Page');
    const options = PageOptions('/', 'Player Page');
    Logging('SILLY', `Player Page: ${JSON.stringify(options, null, 4)}`);
    res.setHeader('Set-Cookie', 'SameSite=Lax');
    res.render('pages/player.ejs', options);
};

export default Home;
