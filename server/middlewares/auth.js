// import { clerkClient } from "@clerk/express";

// // Middleware to check userId and hasPremiumPlan
// export const auth = async (req, res, next) => {
//   try {
//     const { userId, has } = await req.auth();
//     const hasPremiumPlan = await has({ plan: "premium" });

//     const user = await clerkClient.users.getUser(userId);

//     if (!hasPremiumPlan && user.privateMetadata.free_usage) {
//       req.free_usage = user.privateMetadata.free_usage;
//     } else {
//       await clerkClient.users.updateUserMetadata(userId, {
//         privateMetadata: {
//           free_usage: 0,
//         },
//       });
//       req.free_usage = 0;
//     }

//     req.plan = hasPremiumPlan ? "premium" : "free";
//     next();
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };



















import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    console.log(" Auth middleware - Starting authentication...");
    
    // Get auth object from Clerk middleware (requireAuth from server.js)
    const auth = await req.auth();
    const { userId } = auth;

    console.log(" Auth middleware - userId obtained:", userId ? "✅" : "❌");

    if (!userId) {
      console.log(" Auth middleware - userId is null/undefined");
      return res.json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Fetch user
    console.log("📚 Auth middleware - Fetching user from Clerk...");
    const user = await clerkClient.users.getUser(userId);
    console.log("✅ Auth middleware - User fetched successfully");

    // Get premium plan status
    const hasPremiumPlan = user.privateMetadata?.plan === "premium";
    const free_usage = user.privateMetadata?.free_usage || 0;

    // Log the actual metadata for debugging
    console.log("🔍 User Metadata:", {
      plan: user.privateMetadata?.plan,
      hasPremiumPlan,
      free_usage
    });

    // Attach to request
    req.auth = auth;
    req.userId = userId;
    req.plan = hasPremiumPlan ? "premium" : "free";
    req.free_usage = free_usage;

    console.log(" Auth middleware - All data attached to request. Proceeding to next middleware");
    next();
  } catch (error) {
    console.error(" AUTH ERROR:", {
      message: error.message,
      stack: error.stack
    });
    res.json({ 
      success: false, 
      message: error.message || "Authentication failed" 
    });
  }
};
