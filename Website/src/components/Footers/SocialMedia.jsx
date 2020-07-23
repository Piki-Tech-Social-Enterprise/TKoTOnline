import React from 'react';
import PropTypes from 'prop-types';

const SocialMedia = props => {
	const {
		links,
		margin
	} = props;
	return (
		<ul className="list-group">
			{
				links.map((link, key) => {
					const {
						href,
						iconFaName
					} = link;
					return (
						<li className={`box-social ${margin}`} key={key}>
							<a href={href} target="_blank" rel="noopener noreferrer">
								<span class="fa-stack fa-2x">
									<i class="fas fa-circle fa-stack-2x" />
									<i class={`${iconFaName} fa-stack-1x fa-inverse`} />
								</span>
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
	margin: PropTypes.string
};
SocialMedia.defaultProps = {
	margin: ''
};

export default SocialMedia;
