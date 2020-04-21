import React from "react";
import "assets/css/tkot.css"

const SocialMedia = props => {
	return (
		<ul className="social-ul m-0 p-0 d-flex justify-content-center">
			<li className={"box-social" + props.margin}>
				<a href="">
					<i className={"fab fa-facebook"}></i>					
				</a>
			</li>
			<li className={"box-social " + props.margin}>
				<a href="">
					<i className={"fab fa-instagram" } ></i>
				</a>
			</li>

			<li className={"box-social " + props.margin}>
				<a href="">
					<i className="fab fa-linkedin-in"></i>	
				</a>
			</li>
		</ul>

	);
};

export default SocialMedia