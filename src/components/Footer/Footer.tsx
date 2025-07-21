import './Footer.css'
import vkIcon from '../../assets/icons/vk.svg'
import ytIcon from '../../assets/icons/youtube.svg'
import tgIcon from '../../assets/icons/tg.svg'
import gitHubIcon from '../../assets/icons/github.svg'

export const Footer = () => {
    return (
        <footer className="footer" role="contentinfo">
            <div className="container">
                <div className="footer__socials">
                    <a href="https://github.com/Endri94?tab=repositories" target="_blank" rel="noreferrer">
                        <img src={gitHubIcon} alt="GitHub" />
                    </a>
                    <a href="https://vk.com/id730588154" target="_blank" rel="noreferrer">
                        <img src={vkIcon} alt="VK" />
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noreferrer">
                        <img src={ytIcon} alt="YouTube" />
                    </a>
                    <a href="https://t.me/shakeitoff17" target="_blank" rel="noreferrer">
                        <img src={tgIcon} alt="Telegram" />
                    </a>
                </div>
            </div>
        </footer>
    )
}