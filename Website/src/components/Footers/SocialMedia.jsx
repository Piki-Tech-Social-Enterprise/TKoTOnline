import React from 'react';
import PropTypes from 'prop-types';

const SocialMedia = props => {
	const {
		links,
		margin,
		size
	} = props;
	return (
		<ul className="social-ul d-flex">
			{
				links.map((link, key) => {
					const {
						href,
						iconFaName
					} = link;
					return (
						<li className={`box-social ${margin}`} key={key}>
							<a href={href} target="_blank" rel="noopener noreferrer">
								<i className={`social-media-fill ${iconFaName}`} style={{
									fontSize: `${size}px`
								}} />
							</a>
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
		iconFaName: PropTypes.string.isRequired
	})).isRequired,
	margin: PropTypes.string,
	size: PropTypes.number
};
SocialMedia.defaultProps = {
	margin: '',
	size: 40
};

export default SocialMedia;
