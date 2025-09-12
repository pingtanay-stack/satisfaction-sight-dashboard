import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TripDestination {
  id: string;
  destination_name: string;
  vote_count: number;
  suggested_by_user_id: string;
  user_has_voted?: boolean;
}

export function useTripDestinations() {
  const [destinations, setDestinations] = useState<TripDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchDestinations = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      // Get top destinations with vote counts
      const { data, error } = await supabase.rpc('get_top_destinations', { limit_count: 3 });
      
      if (error) throw error;

      // Check which destinations the current user has voted for
      let destinationsWithVoteStatus = data || [];
      if (user.user && destinationsWithVoteStatus.length > 0) {
        const { data: userVotes } = await supabase
          .from('destination_votes')
          .select('destination_id')
          .eq('user_id', user.user.id);

        const votedDestinationIds = new Set(userVotes?.map(v => v.destination_id) || []);
        
        destinationsWithVoteStatus = destinationsWithVoteStatus.map(dest => ({
          ...dest,
          user_has_voted: votedDestinationIds.has(dest.id)
        }));
      }

      setDestinations(destinationsWithVoteStatus);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast({
        title: "Error",
        description: "Failed to load destinations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDestination = async (destinationName: string) => {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add destinations",
        variant: "destructive"
      });
      return false;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('trip_destinations')
        .insert({
          destination_name: destinationName,
          suggested_by_user_id: user.user.id
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your dream destination has been added",
      });

      await fetchDestinations();
      return true;
    } catch (error) {
      console.error('Error creating destination:', error);
      toast({
        title: "Error",
        description: "Failed to add destination",
        variant: "destructive"
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const toggleVote = async (destinationId: string, currentlyVoted: boolean) => {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      toast({
        title: "Authentication required", 
        description: "Please sign in to vote",
        variant: "destructive"
      });
      return;
    }

    try {
      if (currentlyVoted) {
        // Remove vote
        const { error } = await supabase
          .from('destination_votes')
          .delete()
          .eq('destination_id', destinationId)
          .eq('user_id', user.user.id);

        if (error) throw error;
      } else {
        // Add vote
        const { error } = await supabase
          .from('destination_votes')
          .insert({
            destination_id: destinationId,
            user_id: user.user.id
          });

        if (error) throw error;
      }

      await fetchDestinations();
    } catch (error) {
      console.error('Error toggling vote:', error);
      toast({
        title: "Error",
        description: "Failed to update vote",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchDestinations();

    // Set up real-time subscriptions
    const destinationsSubscription = supabase
      .channel('destinations-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'trip_destinations' },
        () => fetchDestinations()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'destination_votes' },
        () => fetchDestinations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(destinationsSubscription);
    };
  }, []);

  return {
    destinations,
    loading,
    submitting,
    createDestination,
    toggleVote,
    refetch: fetchDestinations
  };
}