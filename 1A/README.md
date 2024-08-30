# 1A. Write a sorting algorithm

For the sorting algorithm, I have used **Quick sort** algorithm because I wanted not to use extra space in my algo. As it is mentioned clearly here **_Do the test yourself, don’t ask for help from outsiders_**, that's why I wrote the whole algorithm from scratch.

## Space complexity

I used the in-place sorting approach to not to use extra space in memory.
The Best and average case space complexity is O(logn) and worst case space complexity is O(n)

## Time complexity

I choose **Quick sort** because it's best and average case complexity is O(nlogn).
But, quicksort algo's worst case time complexity is O(n^2). To prevent this, I have used _select a random value for pivot index_.
Now, my algorithm's time complexity in all cases is O(nlogn)

> **Note**
> To be frank, I used some help from google about how to prevent worst case time complexity of O(n^2) because I haven't written a sorting algo from scratch for a while.
