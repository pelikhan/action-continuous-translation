script({
    title: "Generates a changeset from the current changes"
})

const pr = await github.getPullRequest()
if (!pr) cancel(`this command only works in a pull request branch`)