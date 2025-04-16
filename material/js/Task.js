let balance = parseInt(localStorage.getItem('balance')) || 0;
let invitedFriends = parseInt(localStorage.getItem('invitedFriends')) || 0;

// تابع تکمیل تسک
function completeTask(reward, taskName) {
    if (localStorage.getItem(taskName) === 'true') {
        alert('You have already completed this task.');
        return;
    }

    // بررسی تعداد دعوت‌شده‌ها برای هر تسک
    if (taskName === 'invite3' && invitedFriends >= 3) {
        balance += 10000;
        updateBalance();
        localStorage.setItem(taskName, 'true');
        localStorage.setItem('balance', balance);
        alert("🎉 You have completed the task and received your reward!");
    } else if (taskName === 'invite5' && invitedFriends >= 5) {
        balance += 20000;
        updateBalance();
        localStorage.setItem(taskName, 'true');
        localStorage.setItem('balance', balance);
        alert("🎉 You have completed the task and received your reward!");
    } else if (taskName === 'invite10' && invitedFriends >= 10) {
        balance += 70000;
        updateBalance();
        localStorage.setItem(taskName, 'true');
        localStorage.setItem('balance', balance);
        alert("🎉 You have completed the task and received your reward!");
    } else if (taskName === 'invite20' && invitedFriends >= 20) {
        balance += 200000;
        updateBalance();
        localStorage.setItem(taskName, 'true');
        localStorage.setItem('balance', balance);
        alert("🎉 You have completed the task and received your reward!");
    } else {
        alert(`You need to invite more friends to complete this task. Current invites: ${invitedFriends}`);
    }
}

// به‌روزرسانی موجودی
function updateBalance() {
    document.getElementById('balance').textContent = balance;
}

// تابع برای اضافه کردن یک دعوت جدید
function inviteFriend() {
    invitedFriends++;
    localStorage.setItem('invitedFriends', invitedFriends);
    updateInviteTaskStatus();
}

// بررسی وضعیت تسک دعوت دوستان
function updateInviteTaskStatus() {
    let claimButton3 = document.getElementById('claimInvite3');
    let claimButton5 = document.getElementById('claimInvite5');
    let claimButton10 = document.getElementById('claimInvite10');
    let claimButton20 = document.getElementById('claimInvite20');
    
    let inviteTaskStatus = document.getElementById('inviteTaskStatus');
    
    if (invitedFriends >= 3) {
        claimButton3.disabled = false;
        inviteTaskStatus.textContent = "✅ Invite 3 friends - Task Complete!";
    } else {
        claimButton3.disabled = true;
        inviteTaskStatus.textContent = `Invite ${3 - invitedFriends} more friends to complete this task.`;
    }

    if (invitedFriends >= 5) {
        claimButton5.disabled = false;
    } else {
        claimButton5.disabled = true;
    }

    if (invitedFriends >= 10) {
        claimButton10.disabled = false;
    } else {
        claimButton10.disabled = true;
    }

    if (invitedFriends >= 20) {
        claimButton20.disabled = false;
    } else {
        claimButton20.disabled = true;
    }
}

// مقداردهی اولیه هنگام لود صفحه
updateBalance();
updateInviteTaskStatus();
