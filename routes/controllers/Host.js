import Logging from '../../logging.js';
import PageOptions from './PageOptions.js';

const Host = async (req, res) => {
    Logging('INFO', 'Host Page');
    const options = PageOptions('/host', 'Host Page');
    Logging('SILLY', `Host Page: ${JSON.stringify(options, null, 4)}`);
    res.setHeader('Set-Cookie', 'SameSite=Lax');
    res.render('pages/host.ejs', options);
};

export default Host;
