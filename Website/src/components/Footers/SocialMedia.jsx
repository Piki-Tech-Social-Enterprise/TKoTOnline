import React from 'react';
import PropTypes from 'prop-types';
import {
  sendEvent
} from 'components/App/GoogleAnalytics';

const SocialMedia = props => {
	const {
		links,
		margin
	} = props;
	const IconAndTextElement = props => {
		const {
			textClassName,
			icon,
			text
		} = props;
		return (
			<>
				<span className="fa-stack">
					<i className="fas fa-circle fa-stack-2x" />
					<i className={`${icon} fa-stack-1x fa-inverse`} />
				</span>
				<span className={`mx-2 text-uppercase ${textClassName || ''}`}>{text}</span>
			</>
		);
	};
	return (
		<ul className="list-group ml-0 ml-xl-5">
			{
				links.map((link, key) => {
					const {
						href,
						iconFaName,
						text
					} = link;
					return (
						<li className={`box-social ${margin}`} key={key}>
							{
								href
									? <a
										className="box-social-text"
										href={href}
										target="_blank"
										rel="noopener noreferrer"
										onClick={() => sendEvent(`${window.location.pathname} page`, `Clicked "${text}" link`, href)}
									><IconAndTextElement textClassName="box-social-text" icon={iconFaName} text={text} />
									</a>
									: <span className="box-social-text">
										<IconAndTextElement textClassName="box-social-text" icon={iconFaName} text={text} />
									</span>
							}
						</li>
					);
				})
			}
		</ul>
	);
};

SocialMedia.propTypes = {
	links: PropTypes.arrayOf(PropTypes.shape({
		href: PropTypes.string.isRequired,
		iconFaName: PropTypes.string.isRequired,
		text: PropTypes.string
	})).isRequired,
	margin: PropTypes.string
};
SocialMedia.defaultProps = {
	margin: ''
};

export default SocialMedia;
