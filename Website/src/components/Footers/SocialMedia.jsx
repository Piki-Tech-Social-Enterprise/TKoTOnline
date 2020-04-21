import React from "react";
import { ReactComponent as Facebook } from "../../assets/icons/facebook-f-brands.svg";
import { ReactComponent as Instagram } from "../../assets/icons/instagram-brands.svg";
import { ReactComponent as Linkedin } from "../../assets/icons/linkedin-in-brands.svg";
import { Container } from 'reactstrap' 

 
const SocialMedia = props => {
	return (
	<Container >
		<ul className="social-ul d-flex justify-content-center">
			<li className={"box-social" + props.margin}>
				<a href="#TKoTOnline">
					<Facebook
						className="social-media-fill"
						width={props.size}
						height={props.size}
					/>
				</a>
			</li>
			<li className={"box-social " + props.margin}>
				<a href="#TKoTOnline">
					<Instagram
						className="social-media-fill"
						width={props.size}
						height={props.size}
					/>
				</a>
			</li>

			<li className={"box-social " + props.margin}>
				<a href="#TKoTOnline">
					<Linkedin
						className="social-media-fill"
						width={props.size}
						height={props.size}
					/>
				</a>
			</li>
		</ul>
		</Container>
	);
};

export default SocialMedia