const randomEvents = async (user, month, day) => {
    let message = ""
    if (month == 1 && day == 14) {
        message = "you found 5 dollars on the ground"
        user.money += 5
        await user.save()
    }
}