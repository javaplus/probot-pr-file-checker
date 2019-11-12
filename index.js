// Checks API example
// See: https://developer.github.com/v3/checks/ to learn more

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  app.on('pull_request.opened', checkPR);

  async function checkPR (context) {
    app.log("Pull Request created!!!!!!!");
  const repo = context.repo();

  // GH API
  const { paginate, issues, repos, pullRequests } = context.github;
  const { sha } = context.payload.pull_request.head;
  // Hold this PR info
  const statusInfo = { ...repo, sha, context: 'Commit_Message_Bot' };
  


  // Pending
  await repos.createStatus({
    ...statusInfo,
    state: 'pending',
    description: 'Waiting for the status to be reported'
  });    


    const body = context.payload.pull_request.body;
    app.log("body=" + body);

    const pull = context.issue();
    console.log("pull");
    console.log(pull);
    isValid = false;
    if(body && body.includes(".docx")){
      app.log("We have a .docx");
      isValid = true;
    }else{
      app.log("We DO NOT have a .docx");
      console.log("creating new comment!");
      isValid = false;
			await context.github.issues.createComment({ ...pull, body: "Missing a document!!!!" });
    }

    // Final status
		await repos.createStatus({
			...statusInfo,
			state: isValid ? 'success' : 'failure',
			description: `Did not find a Document attached to the original message.`
		});

    /*const pull = context.issue();
    console.log("pull");
    console.log(pull);
    const repo = context.repo();
    console.log(repo);
    const files = context.github.pulls.listFiles(pull.owner,pull.repo,pull.number);
    console.log(files);
    */

  }

  
}
