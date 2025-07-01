async function handleTaskEvent(event) {
  if (event.event === 'task.created') {
    const task = event.data;
    console.log(`✅ Notifying: New task '${task.title}' assigned to ${task.assigned_to}`);
    // Optional: send email/slack/etc.
  }
}

module.exports = { handleTaskEvent };
