# 1LINR
The basic premise for this app is a place where users can post 'one liners' of 50 characters or less. There is no ability to post links or images to individual posts. Users can, however, upload a single profile picture at a time. It's like minimalist social media. In a world where everybody has an opinion and doesn't hesitate to get on a virtual soap box to espouse them, this app denies users the ability to do so. Of you course you can still post divisive or unpopular opinions, so long as you take 50 characters or less to do so. Additionally, there is no comment function for user posts, posts can be like AND disliked and the reactions are kept anonymous. While this may not be a viable social media concept in reality, it allowed me plenty of opportunity to integrate a wide variety of coding solutions and demonstrate a good amount of my knowledge.


Currently, the app allows users to create a basic account, login, view a feed with one post from each other user without any sort of priority sorting algorithm and view, edit and delete their own posts. They can also view a user page for other users by clicking the author name of other users in their feed. This user page has a feed of all of the displayed users posts. Users can log out. All but the create account and log in pages are restricted to logged in users and users are automatically redirected to a gatekeeper page informing them of this until they are logged in. Users can like and dislike posts by other users but not ones posted by themselves. Users can choose to watch other users and can be watched by other users. Users can also stop watching users. A page displays all users that aren't already being watched by the current user. Posts can be edited and are still run through the same validations as new posts to ensure there are no links or pictures embedded in them. Users can also view each others home pages that list all posts a user has made in order of newest to oldest. Users can upload one profile picture. The old one is deleted when a new one is uploaded. Users can add up to ten users to a "short list" that appears on their homepage.  The feed uses a basic algorithm to prioritize users you watch, then users watching you, then people you don't know. There is a basic search function on the discover page that allows you to search for people by username or portion of username. It is not case sensitive. Currently the results are not prioritized.

I am working to update the feed algorithm to go in chronological order. My goal is to make posts from people the user knows appear first, then posts from people that follow the user but that the user doesn't follow, then finally posts from users the current user isn't associated with in any way all in the order they were posted in, most recent first. I'd also like to add a similar algorithm for the look around page that displays new users to check out. I'd like the search on the look around page to also use an algorithm to sort search results to make the more relevant ones pop up first. I'd also like to incorporate infinite scroll into the feed page so it continually loads more posts until it runs out. And finally, I'd like to include an advanced search on the discover page and integrate search functions for posts as well.

current hosted version:
https://shielded-badlands-55529.herokuapp.com/
