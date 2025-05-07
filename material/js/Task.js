// مقدار اولیه
let balance = parseInt(localStorage.getItem('balance')) || 0;
let invitedFriends = parseInt(localStorage.getItem('invitedFriends')) || 0;

// تسک دعوت دوستان
function completeTask(reward, taskName) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('Please login first!');
        return;
    }

    // اگر قبلاً انجام شده
    if (localStorage.getItem(taskName) === 'true') {
        alert('You have already completed this task.');
        return;
    }

    // بررسی شرایط برای هر تسک
    const thresholds = {
        invite3: 3,
        invite5: 5,
        invite10: 10,
        invite20: 20
    };

    const rewards = {
        invite3: 10000,
        invite5: 20000,
        invite10: 70000,
        invite20: 200000
    };

    const requiredInvites = thresholds[taskName];
    const taskReward = rewards[taskName];

    if (invitedFriends >= requiredInvites) {
        balance += taskReward;
        localStorage.setItem('balance', balance);
        localStorage.setItem(taskName, 'true');

        updateBalance();

        alert("🎉 You have completed the task and received your reward!");

        // Optional: sync
        if (typeof syncWithServer === 'function') {
            syncWithServer();
        }
    } else {
        alert(`You need to invite more friends to complete this task. Current invites: ${invitedFriends}`);
    }
}

// نمایش موجودی
function updateBalance() {
    document.getElementById('balance').textContent = balance.toLocaleString();
}

// افزایش تعداد دعوت‌شده‌ها
function inviteFriend() {
    invitedFriends++;
    localStorage.setItem('invitedFriends', invitedFriends);
    updateInviteTaskStatus();
}

// بررسی وضعیت دکمه‌ها
function updateInviteTaskStatus() {
    const claimButton3 = document.getElementById('claimInvite3');
    const claimButton5 = document.getElementById('claimInvite5');
    const claimButton10 = document.getElementById('claimInvite10');
    const claimButton20 = document.getElementById('claimInvite20');

    const inviteTaskStatus = document.getElementById('inviteTaskStatus');

    claimButton3.disabled = invitedFriends < 3;
    claimButton5.disabled = invitedFriends < 5;
    claimButton10.disabled = invitedFriends < 10;
    claimButton20.disabled = invitedFriends < 20;

    inviteTaskStatus.textContent = invitedFriends >= 3
        ? "✅ Invite 3 friends - Task Complete!"
        : `Invite ${3 - invitedFriends} more friends to complete this task.`;
}

// مقداردهی اولیه
updateBalance();
updateInviteTaskStatus();
