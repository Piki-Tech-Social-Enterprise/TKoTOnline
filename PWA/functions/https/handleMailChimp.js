const axios = require('axios');
const credentials = require('credentials.json');

const getCampaigns = async () => {
  let result ={};
  const url = `https://us18.api.mailchimp.com/3.0/campaigns`;
    
  await axios.get(url, {
  headers: {
  Authorization: `Basic ${credentials.api_key}`}
  }).then(resp => {
    result = reduceCampaignData(resp.data);
  }).catch(err => {
    console.log('error', err);
  });
    return result;
}

const reduceCampaignData = async (data) => { 
 try{
  let campaignDataAsArray = [];
  await data.campaigns.map(campaign => {
    campaignDataAsArray.push({id: campaign.id, title: campaign.settings.title, url: campaign.archive_url});
  });

  return campaignDataAsArray;

 }catch (error) {
    console.log('error',error);
 }

  
}
  
exports.getCampaigns = getCampaigns;