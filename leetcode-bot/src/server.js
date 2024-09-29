/**
 * The core server that runs on a Cloudflare worker.
 */

import { AutoRouter } from 'itty-router';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions';
import { ONLINE_COMMAND, INVITE_COMMAND, TEST_COMMAND, GIMME_COMMAND} from './commands.js';
import { InteractionResponseFlags } from 'discord-interactions';



class JsonResponse extends Response {
  constructor(body, init) {
    const jsonBody = JSON.stringify(body);
    init = init || {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    };
    super(jsonBody, init);
  }
}

const router = AutoRouter();
const questions = {
    "Two Sum": "https://leetcode.com/problems/two-sum/",
    "Best Time to Buy and Sell Stock": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    "Contains Duplicate": "https://leetcode.com/problems/contains-duplicate/",
    "Product of Array Except Self": "https://leetcode.com/problems/product-of-array-except-self/",
    "Maximum Subarray": "https://leetcode.com/problems/maximum-subarray/",
    "Maximum Product Subarray": "https://leetcode.com/problems/maximum-product-subarray/",
    "Find Minimum in Rotated Sorted Array": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    "Search in Rotated Sorted Array": "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    "3 Sum": "https://leetcode.com/problems/3sum/",
    "Container With Most Water": "https://leetcode.com/problems/container-with-most-water/",
  
    "Sum of Two Integers": "https://leetcode.com/problems/sum-of-two-integers/",
    "Number of 1 Bits": "https://leetcode.com/problems/number-of-1-bits/",
    "Counting Bits": "https://leetcode.com/problems/counting-bits/",
    "Missing Number": "https://leetcode.com/problems/missing-number/",
    "Reverse Bits": "https://leetcode.com/problems/reverse-bits/",
  
    "Climbing Stairs": "https://leetcode.com/problems/climbing-stairs/",
    "Coin Change": "https://leetcode.com/problems/coin-change/",
    "Longest Increasing Subsequence": "https://leetcode.com/problems/longest-increasing-subsequence/",
    "Longest Common Subsequence": "https://leetcode.com/problems/longest-common-subsequence/",
    "Word Break Problem": "https://leetcode.com/problems/word-break/",
    "Combination Sum": "https://leetcode.com/problems/combination-sum/",
    "House Robber": "https://leetcode.com/problems/house-robber/",
    "House Robber II": "https://leetcode.com/problems/house-robber-ii/",
    "Decode Ways": "https://leetcode.com/problems/decode-ways/",
    "Unique Paths": "https://leetcode.com/problems/unique-paths/",
    "Jump Game": "https://leetcode.com/problems/jump-game/",

    "Clone Graph": "https://leetcode.com/problems/clone-graph/",
    "Course Schedule": "https://leetcode.com/problems/course-schedule/",
    "Pacific Atlantic Water Flow": "https://leetcode.com/problems/pacific-atlantic-water-flow/",
    "Number of Islands": "https://leetcode.com/problems/number-of-islands/",
    "Longest Consecutive Sequence": "https://leetcode.com/problems/longest-consecutive-sequence/",
    "Alien Dictionary (Leetcode Premium)": "https://leetcode.com/problems/alien-dictionary/",
    "Graph Valid Tree (Leetcode Premium)": "https://leetcode.com/problems/graph-valid-tree/",
    "Number of Connected Components in an Undirected Graph (Leetcode Premium)": "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",

    "Insert Interval": "https://leetcode.com/problems/insert-interval/",
    "Merge Intervals": "https://leetcode.com/problems/merge-intervals/",
    "Non-overlapping Intervals": "https://leetcode.com/problems/non-overlapping-intervals/",
    "Meeting Rooms (Leetcode Premium)": "https://leetcode.com/problems/meeting-rooms/",
    "Meeting Rooms II (Leetcode Premium)": "https://leetcode.com/problems/meeting-rooms-ii/",
  
    "Reverse a Linked List": "https://leetcode.com/problems/reverse-linked-list/",
    "Detect Cycle in a Linked List": "https://leetcode.com/problems/linked-list-cycle/",
    "Merge Two Sorted Lists": "https://leetcode.com/problems/merge-two-sorted-lists/",
    "Merge K Sorted Lists": "https://leetcode.com/problems/merge-k-sorted-lists/",
    "Remove Nth Node From End Of List": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    "Reorder List": "https://leetcode.com/problems/reorder-list/",
  
    "Set Matrix Zeroes": "https://leetcode.com/problems/set-matrix-zeroes/",
    "Spiral Matrix": "https://leetcode.com/problems/spiral-matrix/",
    "Rotate Image": "https://leetcode.com/problems/rotate-image/",
    "Word Search": "https://leetcode.com/problems/word-search/",

    "Longest Substring Without Repeating Characters": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    "Longest Repeating Character Replacement": "https://leetcode.com/problems/longest-repeating-character-replacement/",
    "Minimum Window Substring": "https://leetcode.com/problems/minimum-window-substring/",
    "Valid Anagram": "https://leetcode.com/problems/valid-anagram/",
    "Group Anagrams": "https://leetcode.com/problems/group-anagrams/",
    "Valid Parentheses": "https://leetcode.com/problems/valid-parentheses/",
    "Valid Palindrome": "https://leetcode.com/problems/valid-palindrome/",
    "Longest Palindromic Substring": "https://leetcode.com/problems/longest-palindromic-substring/",
    "Palindromic Substrings": "https://leetcode.com/problems/palindromic-substrings/",
    "Encode and Decode Strings (Leetcode Premium)": "https://leetcode.com/problems/encode-and-decode-strings/",
    "Maximum Depth of Binary Tree": "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    "Same Tree": "https://leetcode.com/problems/same-tree/",
    "Invert/Flip Binary Tree": "https://leetcode.com/problems/invert-binary-tree/",
    "Binary Tree Maximum Path Sum": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    "Binary Tree Level Order Traversal": "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    "Serialize and Deserialize Binary Tree": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
    "Subtree of Another Tree": "https://leetcode.com/problems/subtree-of-another-tree/",
    "Construct Binary Tree from Preorder and Inorder Traversal": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
    "Validate Binary Search Tree": "https://leetcode.com/problems/validate-binary-search-tree/",
    "Kth Smallest Element in a BST": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
    "Lowest Common Ancestor of BST": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    "Implement Trie (Prefix Tree)": "https://leetcode.com/problems/implement-trie-prefix-tree/",
    "Add and Search Word": "https://leetcode.com/problems/add-and-search-word-data-structure-design/",
    "Word Search II": "https://leetcode.com/problems/word-search-ii/",
  
    "Top K Frequent Elements": "https://leetcode.com/problems/top-k-frequent-elements/",
    "Find Median from Data Stream": "https://leetcode.com/problems/find-median-from-data-stream/"
  };

/**
 * A simple :wave: hello page to verify the worker is working.
 */
router.get('/', (request, env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

/**
 * Main route for all requests sent from Discord.  All incoming messages will
 * include a JSON payload described here:
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
 */
router.post('/', async (request, env) => {
  const { isValid, interaction } = await server.verifyDiscordRequest(
    request,
    env,
  );
  if (!isValid || !interaction) {
    return new Response('Bad request signature.', { status: 401 });
  }

  if (interaction.type === InteractionType.PING) {
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    return new JsonResponse({
      type: InteractionResponseType.PONG,
    });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    // Most user commands will come as `APPLICATION_COMMAND`.
    switch (interaction.data.name.toLowerCase()) {
        
      case ONLINE_COMMAND.name.toLowerCase(): {
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "Hi, I'm already fucking here.",
          },
        });
      }

      case TEST_COMMAND.name.toLowerCase(): {
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "test",
          },
        });
      }

      case INVITE_COMMAND.name.toLowerCase(): {
        const applicationId = env.DISCORD_APPLICATION_ID;
        const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${applicationId}&scope=applications.commands`;
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: INVITE_URL,
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        });
      }

      case GIMME_COMMAND.name.toLowerCase(): {

        const questionNames = Object.keys(questions);
        const randomIndex = Math.floor(Math.random() * questionNames.length);
        const randomQuestion = questionNames[randomIndex];
        const questionLink = questions[randomQuestion];
        
        const message = `Here's a random Blind 75 question for you:\n\n**${randomQuestion}**\n${questionLink}`;
        
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: message
          },
        });
      }
      default:
        return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
    }
  }

  console.error('Unknown Type');
  return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
});
router.all('*', () => new Response('Not Found.', { status: 404 }));

async function verifyDiscordRequest(request, env) {
  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');
  const body = await request.text();
  const isValidRequest =
    signature &&
    timestamp &&
    (await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY));
  if (!isValidRequest) {
    return { isValid: false };
  }

  return { interaction: JSON.parse(body), isValid: true };
}

const server = {
  verifyDiscordRequest,
  fetch: router.fetch,
};

export default server;