import React from 'react';


const CommunityNetworkLink = ({ link }) => {
  return (
    <div>
      <h3>Community network links</h3>

      <p>Good morning sunshine cough furball i do no work yet get food, shelter, and lots of stuff just 
         like man who lives with us climb leg, or shred all toilet paper and spread around the house, 
         or fight own tail. Plan steps for world domination cat jumps and falls onto the couch purrs.  </p>
      <div class="container">
        <div class="row justify-content-around">
          <div class="col-7 col-sm-md-lg">     
              <ul className="network-links d-flex justify-content-between list-inline ">
                {
                  link.map(l => {
                  console.log(JSON.stringify(l))
              return (
              <li>
                <a href={l.url} category="">{l.displayName}</a>
              </li>
              );
              })
              }      
              </ul>
                        
            </div>
          </div>
        </div>
      </div>
      )}


export default CommunityNetworkLink